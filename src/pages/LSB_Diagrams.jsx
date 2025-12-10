// LSB_Diagrams.jsx（关键片段）
import React, { useState, lazy, Suspense, useRef, useCallback } from "react";
import Button from "../ui/Button";
import PanZoomSVG from "../ui/PanZoomSVG";
import Spinner from "../ui/Spinner";
import DeviceSearchBox from "../ui/DeviceSearchBox";
import Modal, { useModal } from "../ui/Modal";
import DeviceEditor from "../ui/DeviceEditor";

const DIAGRAM_CONFIG = {
  Normal: {
    label: "Normal",
    Component: lazy(() => import("../features/diagrams/LSB/LSB_Normal_Raiser")),
  },
  Emergency: {
    label: "Emergency",
    Component: lazy(
      () => import("../features/diagrams/LSB/LSB_Emergency_Raiser")
    ),
  },
};
const DIAGRAMS = Object.keys(DIAGRAM_CONFIG);
const projectId = "lsb";

export default function LSB_Diagrams() {
  const [active, setActive] = useState("Normal");
  const [selectedDevice, setSelectedDevice] = useState(null);
  return (
    <Modal>
      <div className="flex gap-x-2 mb-3">
        {DIAGRAMS.map((label) => (
          <Button
            key={label}
            onClick={() => setActive(label)}
            disabled={active === label}
            selected={active === label}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="m-2">
        <Suspense fallback={<Spinner />}>
          {/* 👇 真正工作区放在 Provider 里面，这里可以安全用 useModal */}
          <DiagramInner
            active={active}
            projectId={projectId}
            onSelectDevice={setSelectedDevice}
          />
        </Suspense>
      </div>

      {/* 统一弹窗挂在这里 */}
      <Modal.Window name="device" size="xl">
        {({ closeModal }) => (
          <DeviceEditor
            deviceKey="devices" // 可选：自定义
            projectId={projectId}
            closeModal={closeModal}
            device={selectedDevice}
            // DeviceEditor 内部会从 React Query 或 props 拿选中设备（见下）
          />
        )}
      </Modal.Window>
    </Modal>
  );
}

/** 真正的图纸区（位于 Modal Provider 之下），可安全调用 useModal */
function DiagramInner({ active, projectId, onSelectDevice }) {
  const { open } = useModal(); // ✅ 现在这里有 Provider 了
  const [highlightDeviceId, sethighlightDeviceId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // pan/zoom refs
  const panZoomRefs = useRef({});
  const panZoomStateRefs = useRef({});
  if (!panZoomRefs.current[active])
    panZoomRefs.current[active] = React.createRef();
  if (!panZoomStateRefs.current[active])
    panZoomStateRefs.current[active] = {
      scale: 0.3,
      translate: { x: 0, y: 0 },
    };

  // tooltip 容器
  const containerRef = useRef(null);
  const [tip, setTip] = useState({ show: false, x: 0, y: 0, text: "" });

  const showTip = useCallback((e, text) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({
      show: true,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top + 12,
      text,
    });
  }, []);
  const moveTip = useCallback((e, text) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip((prev) => ({
      show: true,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top + 12,
      text: text ?? prev.text,
    }));
  }, []);
  const hideTip = useCallback(() => setTip((t) => ({ ...t, show: false })), []);

  // 搜索定位
  const handlePickDevice = useCallback(
    (item) => {
      const rect = item.rect_px;
      const id = item.id;
      if (!rect || rect.length !== 4) return;

      // 直接调用 PanZoomSVG 暴露的 API（之前给你加过 zoomToRect）
      panZoomRefs.current[active]?.current?.zoomToRect(rect, {
        padding: 60,
        maxScale: 6,
      });

      sethighlightDeviceId(id);
      setTimeout(() => sethighlightDeviceId(null), 2500);
    },
    [active]
  );

  // 点击任意设备 → 选中并打开 modal
  const onNodeClick = useCallback(
    (payload) => {
      onSelectDevice?.(payload);
      queueMicrotask(() => open("device"));
      // console.log(payload);
      // open("device"); // ✅ 现在 open 一定有效
    },
    [open, onSelectDevice]
  );

  const { Component } = DIAGRAM_CONFIG[active];

  const panZoomRef = panZoomRefs.current[active];
  const panZoomStateRef = panZoomStateRefs.current[active];

  // ⭐ 关键：用 useMemo 固定传给 <Component> 的回调对象
  const diagramCallbacks = React.useMemo(
    () => ({
      onNodeEnter: (e, payload) =>
        showTip(e, payload?.tooltip ?? payload?.name ?? "Unknown"),
      onNodeMove: (e, payload) =>
        moveTip(e, payload?.tooltip ?? payload?.name ?? "Unknown"),
      onNodeLeave: hideTip,
      onNodeClick,
    }),
    [showTip, moveTip, hideTip, onNodeClick]
  );
  return (
    <div ref={containerRef} style={{ position: "relative", height: 800 }}>
      <div className="absolute z-10 left-2 top-2 bg-white/85 backdrop-blur px-2 py-2 rounded shadow">
        <DeviceSearchBox
          project={projectId}
          onPick={handlePickDevice}
          placeholder="Search device…"
        />
      </div>

      <PanZoomSVG
        key={active}
        ref={panZoomRef}
        stateRef={{ current: panZoomStateRef }}
        height="800px"
      >
        {/* 把 highlightDeviceId 传给子图层绘制高亮 */}
        <Component
          {...diagramCallbacks}
          highlightDeviceId={highlightDeviceId}
          selectedDevice={selectedDevice}
        />
      </PanZoomSVG>

      {tip.show && (
        <div
          style={{
            position: "absolute",
            left: tip.x,
            top: tip.y,
            pointerEvents: "none",
            background: "rgba(0,0,0,.85)",
            color: "#fff",
            padding: "6px 8px",
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: "nowrap",
            transform: "translate(0, -100%)",
            boxShadow: "0 6px 18px rgba(0,0,0,.25)",
          }}
        >
          {tip.text}
        </div>
      )}

      {/* 把选中设备放到一个不可见的容器里，供 Modal.Window 里的 DeviceEditor 通过 props 或全局状态拿到也可以 */}
      {/* 更简单：把 DeviceEditor 放这里，并通过函数子注入 closeModal（也可行）。这里保持上层 Window 渲染。 */}
      <DeviceEditorHiddenBridge device={selectedDevice} projectId={projectId} />
    </div>
  );
}

/** 选中设备透传桥（可选方案）
 *  如果你希望 DeviceEditor 在 Modal.Window 里渲染，但又要拿到 selectedDevice，
 *  可以用全局 store（Zustand/Context）或简单起见：放到 React Query 的临时缓存里。
 *  这里示例简单起见，什么都不做。你也可以改成写到一个 context。
 */
function DeviceEditorHiddenBridge() {
  return null;
}
