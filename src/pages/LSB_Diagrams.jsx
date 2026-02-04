// src/pages/LSB_Diagrams.jsx
import React, {
  useState,
  lazy,
  Suspense,
  useRef,
  useCallback,
  useEffect,
} from "react";
import Button from "../ui/Button";
import PanZoomSVG from "../ui/PanZoomSVG";
import Spinner from "../ui/Spinner";
import DeviceSearchBox from "../ui/DeviceSearchBox";
import Modal, { useModal } from "../ui/Modal";
import DeviceEditor from "../ui/DeviceEditor";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
const SUBJECTS = ["panel board", "ATS", "Generator", "transformer"];
export default function LSB_Diagrams() {
  const [active, setActive] = useState("Normal");
  const [selectedDevice, setSelectedDevice] = useState(null);

  const qc = useQueryClient();

  useEffect(() => {
    SUBJECTS.forEach((s) => {
      qc.prefetchQuery({
        queryKey: ["subjectSteps", s],
        queryFn: async () => {
          const res = await axios.get(
            `/api/v1/subjects/${encodeURIComponent(s)}/steps?active_only=true`
          );
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
      });
    });
  }, [qc]);
  return (
    <Modal>
      {/* 顶部 Normal / Emergency 切换按钮 */}
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
          <DiagramInner
            active={active}
            projectId={projectId}
            onSelectDevice={setSelectedDevice}
            // ⭐ 传 setActive 给内层，用于搜索结果切换 Normal/Emergency
            onChangeActive={setActive}
          />
        </Suspense>
      </div>

      {/* 统一弹窗挂在这里 */}
      <Modal.Window name="device" size="xl">
        {({ closeModal }) => (
          <DeviceEditor
            deviceKey="devices"
            projectId={projectId}
            closeModal={closeModal}
            device={selectedDevice}
          />
        )}
      </Modal.Window>
    </Modal>
  );
}

/** 真正的图纸区 */
function DiagramInner({ active, projectId, onSelectDevice, onChangeActive }) {
  const { open } = useModal();

  const [highlightDeviceId, setHighlightDeviceId] = useState(null);
  const [selectedDeviceLocal, setSelectedDeviceLocal] = useState(null);

  // ⭐ 保存“待跨页聚焦”的信息（rect + id + page）
  const [pendingFocus, setPendingFocus] = useState(null);

  // pan/zoom refs & 状态（每个模式一套）
  const panZoomRefs = useRef({});
  const panZoomStateRefs = useRef({});
  if (!panZoomStateRefs.current[active]) {
    panZoomStateRefs.current[active] = {
      scale: 0.3,
      translate: { x: 0, y: 0 },
    };
  }

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

  // ⭐ 搜索结果点击：
  //   - 同页：直接 zoom
  //   - 跨页：记下 pendingFocus + 切 tab，等新页的 ref ready 后 zoom
  const handlePickDevice = useCallback(
    (item) => {
      const rect = item.rect_px;
      const id = item.id;
      const page = item.file_page ?? item.page; // 1=Normal, 2=Emergency

      if (!rect || rect.length !== 4) return;

      const targetMode = page === 2 ? "Emergency" : "Normal";

      // ✅ 当前页就能显示 → 直接 zoom
      if (targetMode === active) {
        const instance = panZoomRefs.current[active];
        if (instance && typeof instance.zoomToRect === "function") {
          instance.zoomToRect(rect, { padding: 60, maxScale: 6 });
          setHighlightDeviceId(id);
          setTimeout(() => setHighlightDeviceId(null), 2500);
          return;
        }
      }

      // ❗ 需要跨页：先记录任务，再切 tab，真正 zoom 放到 ref 回调里
      setPendingFocus({ rect, id, page });
      if (active !== targetMode) {
        onChangeActive?.(targetMode);
      }
    },
    [active, onChangeActive]
  );

  // ⭐ 用 callback ref 来拿到 PanZoomSVG 实例
  const attachPanZoomRef = useCallback(
    (mode) => (node) => {
      // mount / unmount 都会进来
      panZoomRefs.current[mode] = node || null;

      // 如果这个 mode 的实例刚刚 mount 且有待聚焦任务 → 在这里 zoom
      if (node && pendingFocus && typeof node.zoomToRect === "function") {
        const { rect, id, page } = pendingFocus;
        const targetMode = page === 2 ? "Emergency" : "Normal";

        if (
          targetMode === mode &&
          rect &&
          Array.isArray(rect) &&
          rect.length === 4
        ) {
          node.zoomToRect(rect, { padding: 60, maxScale: 6 });
          setHighlightDeviceId(id);
          setTimeout(() => setHighlightDeviceId(null), 2500);
          setPendingFocus(null); // ✅ 任务完成，清掉
        }
      }
    },
    [pendingFocus]
  );

  // 点击任意设备 → 选中并打开 modal
  const onNodeClick = useCallback(
    (payload) => {
      setSelectedDeviceLocal(payload);
      onSelectDevice?.(payload);
      queueMicrotask(() => open("device"));
    },
    [open, onSelectDevice]
  );

  const { Component } = DIAGRAM_CONFIG[active];
  const panZoomStateRef = panZoomStateRefs.current[active];

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
      {/* 搜索框浮层 */}
      <div className="absolute z-10 left-2 top-2 bg-white/85 backdrop-blur px-2 py-2 rounded shadow">
        <DeviceSearchBox
          project={projectId}
          onPick={handlePickDevice}
          placeholder="Search device…"
        />
      </div>

      {/* 主图层 */}
      <PanZoomSVG
        key={active}
        ref={attachPanZoomRef(active)} // ⭐ callback ref
        stateRef={{ current: panZoomStateRef }}
        height="800px"
      >
        <Component
          {...diagramCallbacks}
          highlightDeviceId={highlightDeviceId}
          selectedDevice={selectedDeviceLocal}
        />
      </PanZoomSVG>

      {/* tooltip */}
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
    </div>
  );
}
