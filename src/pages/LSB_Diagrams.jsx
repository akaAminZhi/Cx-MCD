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

// 越早越迫切：Earliest 最深、Latest 最浅
const HEAT_BUCKET_COLORS = {
  earliest: "#B91C1C", // deep red
  early: "#DC2626", // red
  middle: "#EA580C", // orange
  midLate: "#F59E0B", // amber
  late: "#FCD34D", // yellow
  latest: "#FEF3C7", // pale warm yellow
};

const HEAT_BUCKET_TEXT_COLORS = {
  earliest: "#FFFFFF",
  early: "#FFFFFF",
  middle: "#FFFFFF",
  midLate: "#111827",
  late: "#111827",
  latest: "#374151",
};

const HEAT_BUCKET_LABELS = {
  earliest: "Earliest",
  early: "Early",
  middle: "Middle",
  midLate: "Mid-late",
  late: "Late",
  latest: "Latest",
};

const HEAT_BUCKET_ORDER = [
  "earliest",
  "early",
  "middle",
  "midLate",
  "late",
  "latest",
];

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
            onChangeActive={setActive}
          />
        </Suspense>
      </div>

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

  const [pendingFocus, setPendingFocus] = useState(null);

  const panZoomRefs = useRef({});
  const panZoomStateRefs = useRef({});
  if (!panZoomStateRefs.current[active]) {
    panZoomStateRefs.current[active] = {
      scale: 0.3,
      translate: { x: 0, y: 0 },
    };
  }

  const containerRef = useRef(null);
  const [tip, setTip] = useState({ show: false, x: 0, y: 0, text: "" });

  // All heatmap 模式下关闭图纸 tooltip
  const shouldDisableDiagramTooltip = scheduleViewMode === "all";

  const showTip = useCallback(
    (e, text) => {
      if (shouldDisableDiagramTooltip) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTip({
        show: true,
        x: e.clientX - rect.left + 12,
        y: e.clientY - rect.top + 12,
        text,
      });
    },
    [shouldDisableDiagramTooltip]
  );

  const moveTip = useCallback(
    (e, text) => {
      if (shouldDisableDiagramTooltip) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTip((prev) => ({
        show: true,
        x: e.clientX - rect.left + 12,
        y: e.clientY - rect.top + 12,
        text: text ?? prev.text,
      }));
    },
    [shouldDisableDiagramTooltip]
  );

  const hideTip = useCallback(() => setTip((t) => ({ ...t, show: false })), []);

  const handlePickDevice = useCallback(
    (item) => {
      const rect = item.rect_px;
      const id = item.id;
      const page = item.file_page ?? item.page;

      if (!rect || rect.length !== 4) return;

      const targetMode = page === 2 ? "Emergency" : "Normal";

      if (targetMode === active) {
        const instance = panZoomRefs.current[active];
        if (instance && typeof instance.zoomToRect === "function") {
          instance.zoomToRect(rect, { padding: 60, maxScale: 6 });
          setHighlightDeviceId(id);
          setTimeout(() => setHighlightDeviceId(null), 2500);
          return;
        }
      }

      setPendingFocus({ rect, id, page });
      if (active !== targetMode) {
        onChangeActive?.(targetMode);
      }
    },
    [active, onChangeActive]
  );

  const attachPanZoomRef = useCallback(
    (mode) => (node) => {
      panZoomRefs.current[mode] = node || null;

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
          setPendingFocus(null);
        }
      }
    },
    [pendingFocus]
  );

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

  // 全局按日期顺序映射到 6 个 bucket
  // 越早 -> 越迫切 -> earliest -> 最深暖色
  const dateBucketMap = useMemo(() => {
    const uniqueDates = [...sortedScheduleDates];
    if (!uniqueDates.length) return {};

    const total = uniqueDates.length;
    const map = {};

    uniqueDates.forEach((dateKey, index) => {
      const ratio = total === 1 ? 0 : index / (total - 1);

      let bucket = "earliest";
      if (ratio <= 0.16) bucket = "earliest";
      else if (ratio <= 0.33) bucket = "early";
      else if (ratio <= 0.5) bucket = "middle";
      else if (ratio <= 0.66) bucket = "midLate";
      else if (ratio <= 0.83) bucket = "late";
      else bucket = "latest";

      map[dateKey] = bucket;
    });

    return map;
  }, [sortedScheduleDates]);

  const buildTemporalHeatColor = useCallback(
    (dateKey) => {
      if (!dateKey) return null;
      const bucket = dateBucketMap[dateKey];
      return bucket ? HEAT_BUCKET_COLORS[bucket] : null;
    },
    [dateBucketMap]
  );

  const getTemporalTextColor = useCallback(
    (dateKey) => {
      if (!dateKey) return "#64748b";
      const bucket = dateBucketMap[dateKey];
      return bucket ? HEAT_BUCKET_TEXT_COLORS[bucket] : "#64748b";
    },
    [dateBucketMap]
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

      const daysFromToday = Math.round(
        (dateKeyToMs(key) - dateKeyToMs(todayDateKey)) / (1000 * 60 * 60 * 24)
      );

      const bucket = dateBucketMap[key] || null;

      days.push({
        key,
        day,
        count,
        tone: count > 0 ? buildTemporalHeatColor(key) : null,
        textColor: count > 0 ? getTemporalTextColor(key) : "#64748b",
        daysFromToday,
        isNearest: key === nearestScheduleDate,
        bucket,
      });
    }

    return { startWeekday: start.getUTCDay(), days };
  }, [
    calendarMonth,
    scheduleStats.byDate,
    buildTemporalHeatColor,
    getTemporalTextColor,
    dateKeyToMs,
    todayDateKey,
    nearestScheduleDate,
    dateBucketMap,
  ]);

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
        return {
          energizedToday: false,
          colorOverride: buildTemporalHeatColor(scheduleDate),
        };
      }

      return {
        energizedToday: item.energized_today,
        colorOverride: undefined,
      };
    },
    [scheduleViewMode, selectedScheduleDate, buildTemporalHeatColor]
  );

  return (
    <div ref={containerRef} style={{ position: "relative", height: 800 }}>
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

            {calendarDays.days.map((dayItem) => {
              const isSelected = selectedScheduleDate === dayItem.key;
              const isNearToday =
                dayItem.daysFromToday >= 0 && dayItem.daysFromToday <= 3;

              return (
                <button
                  key={dayItem.key}
                  type="button"
                  onClick={() => {
                    setSelectedScheduleDate(dayItem.key);
                    setScheduleViewMode("date");
                  }}
                  className={`relative h-20 rounded-lg text-base font-medium border transition ${
                    isSelected
                      ? "border-orange-500 ring-2 ring-orange-300 shadow"
                      : dayItem.isNearest
                        ? "border-sky-500 ring-2 ring-sky-200"
                        : "border-slate-200 hover:border-indigo-300 hover:shadow"
                  }`}
                  style={{
                    background: dayItem.tone || "#fff",
                    color: dayItem.count ? dayItem.textColor : "#64748b",
                  }}
                >
                  {isNearToday && (
                    <div className="absolute top-1 right-1 rounded-full bg-sky-600 text-white text-[10px] leading-none px-1.5 py-1 shadow">
                      {dayItem.daysFromToday === 0
                        ? "Today"
                        : `+${dayItem.daysFromToday}`}
                    </div>
                  )}

                  {dayItem.isNearest && !isNearToday && (
                    <div className="absolute top-1 right-1 rounded-full bg-indigo-600 text-white text-[10px] leading-none px-1.5 py-1 shadow">
                      Nearest
                    </div>
                  )}

                  <div className="mt-2">{dayItem.day}</div>

                  {dayItem.count > 0 && (
                    <div className="mt-2 text-xs font-semibold opacity-95">
                      {dayItem.count} dev
                    </div>
                  )}
                </button>
              );
            })}
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

          <div className="space-y-2">
            {HEAT_BUCKET_ORDER.map((bucket) => (
              <div key={bucket} className="flex items-center gap-3">
                <span
                  className="inline-block w-8 h-8 rounded-md border border-slate-300"
                  style={{ background: HEAT_BUCKET_COLORS[bucket] }}
                />
                <span className="text-xl">{HEAT_BUCKET_LABELS[bucket]}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center min-w-[40px] h-6 rounded-full bg-sky-600 text-white text-[10px] px-2">
                +0~3
              </span>
              <span className="text-sm">Within next 3 days</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center min-w-[52px] h-6 rounded-full bg-indigo-600 text-white text-[10px] px-2">
                Nearest
              </span>
              <span className="text-sm">Nearest scheduled date</span>
            </div>

            <div className="text-xs text-slate-500">
              Device count is shown directly inside each date cell.
            </div>
          </div>
        </div>
      )}

      <PanZoomSVG
        key={active}
        ref={attachPanZoomRef(active)}
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
