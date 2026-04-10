// src/pages/LSB_Diagrams.jsx
import React, {
  useState,
  lazy,
  Suspense,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Button from "../ui/Button";
import PanZoomSVG from "../ui/PanZoomSVG";
import Spinner from "../ui/Spinner";
import DeviceSearchBox from "../ui/DeviceSearchBox";
import Modal, { useModal } from "../ui/Modal";
import DeviceEditor from "../ui/DeviceEditor";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useProjecDevices from "../hooks/useProjectDevices";

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
  const { data: devicesData } = useProjecDevices(projectId);

  const [highlightDeviceId, setHighlightDeviceId] = useState(null);
  const [selectedDeviceLocal, setSelectedDeviceLocal] = useState(null);
  const [showSchedulePanel, setShowSchedulePanel] = useState(false);
  const [scheduleViewMode, setScheduleViewMode] = useState("none"); // none | date | all
  const [selectedScheduleDate, setSelectedScheduleDate] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

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

  const scheduledDevices = useMemo(() => {
    if (!Array.isArray(devicesData?.data)) return [];
    return devicesData.data.filter((item) => item?.will_energized_at);
  }, [devicesData]);

  const scheduleStats = useMemo(() => {
    const byDate = {};
    let maxCount = 0;

    scheduledDevices.forEach((item) => {
      const key = String(item.will_energized_at).slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
      byDate[key] = (byDate[key] || 0) + 1;
      maxCount = Math.max(maxCount, byDate[key]);
    });

    return { byDate, maxCount };
  }, [scheduledDevices]);

  const todayDateKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const sortedScheduleDates = useMemo(
    () => Object.keys(scheduleStats.byDate).sort(),
    [scheduleStats.byDate]
  );

  const dateKeyToMs = useCallback(
    (key) => new Date(`${key}T00:00:00Z`).getTime(),
    []
  );

  const heatRange = useMemo(() => {
    if (!sortedScheduleDates.length) return null;
    const minMs = dateKeyToMs(sortedScheduleDates[0]);
    const maxMs = dateKeyToMs(
      sortedScheduleDates[sortedScheduleDates.length - 1]
    );
    return {
      minMs,
      maxMs,
      spanMs: Math.max(1, maxMs - minMs),
    };
  }, [sortedScheduleDates, dateKeyToMs]);

  const nearestScheduleDate = useMemo(() => {
    if (!sortedScheduleDates.length) return "";
    const nextDate = sortedScheduleDates.find(
      (dateKey) => dateKey >= todayDateKey
    );
    return nextDate || sortedScheduleDates[sortedScheduleDates.length - 1];
  }, [sortedScheduleDates, todayDateKey]);
  const daysUntilNearestSchedule = useMemo(() => {
    if (!nearestScheduleDate) return null;

    const today = new Date(`${todayDateKey}T00:00:00Z`);
    const nearest = new Date(`${nearestScheduleDate}T00:00:00Z`);

    const diffMs = nearest.getTime() - today.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, [nearestScheduleDate, todayDateKey]);

  const buildTemporalHeatColor = useCallback(
    (dateKey, count = 1) => {
      if (!dateKey || !heatRange) return null;

      const pointMs = dateKeyToMs(dateKey);
      if (!Number.isFinite(pointMs)) return null;

      const rawRatio = (pointMs - heatRange.minMs) / heatRange.spanMs;
      const ratio = Number.isFinite(rawRatio) ? rawRatio : 0;
      const dateDepth = Math.max(0, Math.min(1, ratio));
      const countDepth = scheduleStats.maxCount
        ? Math.max(0, Math.min(1, count / scheduleStats.maxCount))
        : 0.7;
      const palette = [
        [124, 58, 237], // earliest
        [59, 130, 246],
        [34, 197, 94],
        [250, 204, 21],
        [249, 115, 22],
        [239, 68, 68], // latest
      ];

      const colorIdx = Math.max(0, Math.min(5, Math.floor(ratio / 0.1667)));
      const segmentStart = colorIdx / 6;
      const segmentEnd = (colorIdx + 1) / 6;
      const localRatio =
        segmentEnd - segmentStart > 0
          ? (dateDepth - segmentStart) / (segmentEnd - segmentStart)
          : 0;
      const withinFamilyDepth = Math.max(0, Math.min(1, localRatio));
      const [r, g, b] = palette[colorIdx];

      // 在同一色系里用不同深浅表达差异（越深表示越“重”）。
      const familyDepth = 0.7 * withinFamilyDepth + 0.3 * countDepth;
      const mixWithWhite = 0.65 - familyDepth * 0.55; // 0.1 ~ 0.65 (增强同色系差异)
      const shade = (channel) =>
        Math.round(channel * (1 - mixWithWhite) + 255 * mixWithWhite);

      return `rgb(${shade(r)}, ${shade(g)}, ${shade(b)})`;
    },
    [dateKeyToMs, heatRange, scheduleStats.maxCount]
  );

  const shiftCalendarMonth = useCallback(
    (offset) => {
      const [yearStr, monthStr] = calendarMonth.split("-");
      const date = new Date(
        Date.UTC(Number(yearStr), Number(monthStr) - 1 + offset, 1)
      );
      const nextMonth = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}`;
      setCalendarMonth(nextMonth);
    },
    [calendarMonth]
  );

  const selectedDateDeviceCount = selectedScheduleDate
    ? scheduleStats.byDate[selectedScheduleDate] || 0
    : 0;

  const calendarDays = useMemo(() => {
    const [yearStr, monthStr] = calendarMonth.split("-");
    const year = Number(yearStr);
    const monthIndex = Number(monthStr) - 1;
    const start = new Date(Date.UTC(year, monthIndex, 1));
    const endDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const days = [];

    for (let day = 1; day <= endDay; day += 1) {
      const current = new Date(Date.UTC(year, monthIndex, day));
      const key = current.toISOString().slice(0, 10);
      const count = scheduleStats.byDate[key] || 0;
      days.push({
        key,
        day,
        count,
        tone: buildTemporalHeatColor(key, count),
      });
    }
    return { startWeekday: start.getUTCDay(), days };
  }, [calendarMonth, scheduleStats.byDate, buildTemporalHeatColor]);

  const getDeviceVisualState = useCallback(
    (item) => {
      if (!item || item.energized) {
        return {
          energizedToday: item?.energized_today ?? false,
          colorOverride: undefined,
        };
      }

      const scheduleDate = item.will_energized_at
        ? String(item.will_energized_at).slice(0, 10)
        : null;

      if (!scheduleDate) {
        return {
          energizedToday: item.energized_today,
          colorOverride: undefined,
        };
      }

      if (
        scheduleViewMode === "date" &&
        selectedScheduleDate === scheduleDate
      ) {
        return {
          energizedToday: true,
          colorOverride: "#f97316",
        };
      }

      if (scheduleViewMode === "all") {
        const count = scheduleStats.byDate[scheduleDate] || 0;
        return {
          energizedToday: false,
          colorOverride: buildTemporalHeatColor(scheduleDate, count),
        };
      }

      return {
        energizedToday: item.energized_today,
        colorOverride: undefined,
      };
    },
    [
      scheduleViewMode,
      selectedScheduleDate,
      scheduleStats.byDate,
      buildTemporalHeatColor,
    ]
  );

  return (
    <div ref={containerRef} style={{ position: "relative", height: 800 }}>
      {/* 搜索框浮层 */}
      <div className="absolute z-10 left-2 top-2 bg-white/85 backdrop-blur px-2 py-2 rounded shadow flex gap-2 items-center">
        <DeviceSearchBox
          project={projectId}
          onPick={handlePickDevice}
          placeholder="Search device…"
        />
        <Button onClick={() => setShowSchedulePanel((v) => !v)}>
          Energize Calendar
        </Button>
      </div>

      {showSchedulePanel && (
        <div className="absolute z-20 left-2 top-16 w-[960px] rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/50 shadow-2xl p-6 backdrop-blur">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h4 className="text-2xl font-semibold text-slate-900">
                Energize Schedule
              </h4>
              <p className="text-sm text-slate-500">
                Explore planned energize dates and paint devices directly on the
                LSB diagram.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close calendar"
              className="rounded-md px-3 py-1 text-2xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setShowSchedulePanel(false)}
            >
              ×
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-indigo-100 bg-white/90 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                View mode
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                {[
                  { value: "none", label: "Off" },
                  { value: "date", label: "Selected day" },
                  { value: "all", label: "All heatmap" },
                  { value: "nearest", label: "Nearest date" },
                ].map((mode) => {
                  const isNearestActive =
                    mode.value === "nearest" &&
                    scheduleViewMode === "date" &&
                    selectedScheduleDate === nearestScheduleDate;

                  const isActive =
                    mode.value === "nearest"
                      ? isNearestActive
                      : scheduleViewMode === mode.value;

                  return (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => {
                        if (mode.value === "nearest") {
                          if (!nearestScheduleDate) return;
                          setSelectedScheduleDate(nearestScheduleDate);
                          setScheduleViewMode("date");
                          setCalendarMonth(nearestScheduleDate.slice(0, 7));
                          return;
                        }
                        setScheduleViewMode(mode.value);
                      }}
                      className={`rounded-lg border px-2 py-3 font-medium transition ${
                        isActive
                          ? "border-indigo-500 bg-indigo-600 text-white shadow"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-white/90 p-4">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                Month / Date selection
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => shiftCalendarMonth(-1)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                >
                  ◀ Prev
                </button>
                <input
                  type="month"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base"
                  value={calendarMonth}
                  onChange={(e) => setCalendarMonth(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => shiftCalendarMonth(1)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-base font-medium text-slate-500 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
              <div key={`${d}-${idx}`} className="text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: calendarDays.startWeekday }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-20" />
            ))}
            {calendarDays.days.map((dayItem) => (
              <button
                key={dayItem.key}
                type="button"
                onClick={() => {
                  setSelectedScheduleDate(dayItem.key);
                  setScheduleViewMode("date");
                }}
                className={`h-20 rounded-lg text-base font-medium border transition ${
                  selectedScheduleDate === dayItem.key
                    ? "border-orange-500 ring-2 ring-orange-300 shadow"
                    : "border-slate-200 hover:border-indigo-300 hover:shadow"
                }`}
                style={{
                  background: dayItem.tone || "#fff",
                  color: dayItem.count ? "#0f172a" : "#64748b",
                }}
                title={
                  dayItem.count
                    ? `${dayItem.key}: ${dayItem.count} devices scheduled`
                    : `${dayItem.key}: no devices scheduled`
                }
              >
                <div>{dayItem.day}</div>
                {dayItem.count > 0 && (
                  <div className="text-sm opacity-85">{dayItem.count} dev</div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-slate-600">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Scheduled devices
              </div>
              <div className="text-xl font-semibold text-slate-800">
                {scheduledDevices.length}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-slate-600">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Selected date load
              </div>
              <div className="text-xl font-semibold text-slate-800">
                {selectedDateDeviceCount} devices
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-slate-600">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Nearest date
              </div>
              <div className="text-lg font-semibold text-slate-800">
                {nearestScheduleDate || "N/A"}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {daysUntilNearestSchedule == null
                  ? ""
                  : daysUntilNearestSchedule > 0
                    ? `${daysUntilNearestSchedule} day(s) remaining`
                    : daysUntilNearestSchedule === 0
                      ? "Today"
                      : `${Math.abs(daysUntilNearestSchedule)} day(s) ago`}
              </div>
            </div>
          </div>
        </div>
      )}

      {scheduleViewMode === "all" && (
        <div className="absolute z-20 right-3 bottom-3 bg-white/95 border-2 border-slate-300 rounded-xl shadow-xl px-6 py-4 text-sm text-slate-700 min-w-[200px]">
          <p className="font-semibold mb-3 text-base">Heatmap Legend</p>
          <div className="space-y-1">
            {[
              ["rgb(155, 106, 240)", "Earliest schedule window"],
              ["rgb(98, 160, 248)", "Early schedule window"],
              ["rgb(81, 214, 127)", "Middle schedule window"],
              ["rgb(251, 218, 92)", "Mid-late schedule window"],
              ["rgb(250, 150, 82)", "Late schedule window"],
              ["rgb(243, 113, 113)", "Latest schedule window"],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="inline-block w-8 h-8 rounded-md border border-slate-300"
                  style={{ background: color }}
                />
                <span className="text-xl">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
          getDeviceVisualState={getDeviceVisualState}
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
