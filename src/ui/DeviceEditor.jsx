import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiDocumentArrowDown,
  HiEye,
} from "react-icons/hi2";

import Button from "./Button";
import { useDeviceFiles } from "../hooks/useDeviceFiles";
import { useUploadDeviceFile } from "../hooks/useUploadDeviceFile";
import { useSubjectSteps } from "../hooks/useSubjectSteps";

/**
 * StatusStepper
 * - props:
 *    statuses: array of step labels, in order
 *    currentStatus: string (must match one of statuses)
 *    onStepClick?: function(index, label)
 *
 * 视觉说明：
 * - completed: green badge with check + filled connector
 * - current: indigo badge with index number + highlighted connector section
 * - upcoming: gray badge with index number + muted connector
 *
 * 横向响应：在窄屏设备上支持横向滚动。
 */
function StatusStepper({ steps = [], currentKey, onStepClick }) {
  const count = steps.length || 1;
  const rawIndex = steps.findIndex((s) => s.key === currentKey);
  const currentIndex = rawIndex >= 0 ? rawIndex : 0;

  return (
    // 关键：允许 y 方向可见 + 给上/下留出空间
    <div className="w-full overflow-x-auto overflow-y-visible py-3">
      <style>{`
        @keyframes dashFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -16; }
        }

        /* 线条轻微 glow（current 段） */
        @keyframes glowPulseLine {
          0%, 100% { opacity: .18; filter: drop-shadow(0 0 0 rgba(79,70,229,0)); }
          50%      { opacity: .35; filter: drop-shadow(0 0 6px rgba(79,70,229,.28)); }
        }

        /* 方案2：box-shadow 呼吸（更自然） */
        @keyframes dotGlow {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(99,102,241,0.00),
              0 0 0 0 rgba(99,102,241,0.00);
          }
          50% {
            box-shadow:
              0 0 0 6px rgba(99,102,241,0.18),
              0 0 18px 2px rgba(99,102,241,0.28);
          }
        }
      `}</style>

      <div
        className="grid items-start gap-x-6 px-2"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => {
          const label = step.label;
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          const dotClass = isCompleted
            ? "bg-indigo-600 text-white"
            : isCurrent
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 text-slate-600";

          const textClass = isCompleted
            ? "text-indigo-600"
            : isCurrent
              ? "text-indigo-700 font-semibold"
              : "text-slate-600";

          const segmentState =
            i < currentIndex
              ? "completed"
              : i === currentIndex
                ? "current"
                : "upcoming";

          const hasNext = i < count - 1;

          return (
            <div key={`${label}-${i}`} className="flex flex-col items-center">
              {/* Dot + connector layer */}
              {/* 关键：这里加 py-2 给光晕留空间，避免被 svg/布局挤压 */}
              <div className="relative w-full flex items-center justify-center py-2">
                {hasNext && (
                  <svg
                    className="absolute left-1/2 top-1/2 w-full h-10 -translate-y-1/2 pointer-events-none"
                    viewBox="0 0 100 24"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    {/* completed */}
                    {segmentState === "completed" && (
                      <g className="text-indigo-600">
                        <line
                          x1="10"
                          y1="12"
                          x2="95"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </g>
                    )}

                    {/* current: 轻微 glow + 虚线流动 */}
                    {segmentState === "current" && (
                      <g className="text-indigo-600">
                        <line
                          x1="10"
                          y1="12"
                          x2="95"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                          style={{
                            animation:
                              "glowPulseLine 1.8s ease-in-out infinite",
                          }}
                          opacity="0.22"
                        />
                        <line
                          x1="10"
                          y1="12"
                          x2="95"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity="0.18"
                        />
                        <line
                          x1="10"
                          y1="12"
                          x2="95"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="6 6"
                          style={{
                            animation: "dashFlow 1.05s linear infinite",
                          }}
                        />
                      </g>
                    )}

                    {/* upcoming */}
                    {segmentState === "upcoming" && (
                      <g className="text-slate-300">
                        <line
                          x1="10"
                          y1="12"
                          x2="95"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </svg>
                )}

                {/* Dot */}
                <button
                  type="button"
                  onClick={() => onStepClick?.(i, step)}
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold transition-colors ${dotClass}`}
                  aria-current={isCurrent ? "step" : undefined}
                  style={
                    isCurrent
                      ? {
                          animation: "dotGlow 1.8s ease-in-out infinite",
                          transform: "scale(1.05)",
                          transition: "transform 200ms ease",
                        }
                      : undefined
                  }
                >
                  {isCompleted ? <HiOutlineCheck className="w-5 h-5" /> : i + 1}
                </button>
              </div>

              {/* Label */}
              <div
                className={`mt-1 text-xl text-center leading-snug max-w-[160px] ${textClass}`}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

StatusStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  currentKey: PropTypes.string,
  onStepClick: PropTypes.func,
};

/* ===================== DeviceEditor ===================== */

export default function DeviceEditor({ device, projectId, closeModal }) {
  const [name, setName] = useState(device?.text || device?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const [comments, setComments] = useState(device?.comments ?? "");
  const [showComments, setShowComments] = useState(
    !!(device?.comments && device.comments.length > 0)
  );

  const [energized, setEnergized] = useState(!!device?.energized);
  const [energizedToday, setEnergizedToday] = useState(
    !!device?.energized_today
  );
  const [willAt, setWillAt] = useState(
    device?.will_energized_at ? new Date(device.will_energized_at) : null
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [fileType, setFileType] = useState("panel_schedule");

  useEffect(() => {
    setName(device?.text || device?.name || "");
    setIsEditingName(false);
    setComments(device?.comments ?? "");
    setShowComments(!!(device?.comments && device.comments.length > 0));
    setEnergized(!!device?.energized);
    setEnergizedToday(!!device?.energized_today);
    setWillAt(
      device?.will_energized_at ? new Date(device.will_energized_at) : null
    );
    setSelectedFile(null);
    setUploadingFile(null);
    setFileType("panel_schedule");
  }, [device]);

  const qc = useQueryClient();
  const subject = device?.subject;

  // 从缓存读：prefetchQuery 已经塞进去了
  const {
    data: stepsResp,
    isLoading: stepsLoading,
    isError,
  } = useSubjectSteps(subject);
  const subjectSteps = stepsResp?.data ?? [];

  const currentKey = device?.current_status || subjectSteps?.[0]?.key || "";
  const mutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(`/api/v1/devices/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projectEquipments", projectId] });
      qc.invalidateQueries({ queryKey: ["devices", projectId] });
      qc.invalidateQueries({ queryKey: ["deviceFiles"] });
      closeModal?.();
    },
  });

  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
  } = useDeviceFiles(device.id);
  const files = filesData?.data ?? [];
  const uploadMutation = useUploadDeviceFile();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
    e.target.value = "";
  };

  const handleClickUpload = () => {
    if (!selectedFile) return;
    setUploadingFile(selectedFile);
    uploadMutation.mutate({
      deviceId: device.id,
      file: selectedFile,
      fileType,
    });
    setSelectedFile(null);
  };

  const handleDownload = async (file) => {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed.");
    }
  };

  const handlePreview = async (file) => {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(res.data);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      alert("Preview failed.");
    }
  };

  if (!device)
    return <div className="text-lg text-gray-500 p-4">Loading device…</div>;

  const save = () => {
    const payload = {
      text: name,
      comments,
      energized,
      energized_today: energized ? false : energizedToday,
      will_energized_at: willAt ? new Date(willAt).toISOString() : null,
    };
    mutation.mutate({ id: device.id, payload });
  };

  // optional click handler (现在只是 console.log，方便将来扩展)
  const handleStepClick = (index, label) => {
    // 如果你想允许点击跳转到某一步（例如展示日志、打开编辑器）， 在这里实现
    // 当前我们仅做调试输出
    console.log("step clicked", index, label);
  };

  /* Reuse StatusBadge component idea from earlier? keep simple here - stepper already shows status */

  return (
    <div className="w-[min(92vw,88rem)] max-h-[88vh] overflow-hidden p-6 text-xl">
      {/* Top: Status Progress / Stepper */}
      <div className="mb-4">
        {stepsLoading ? (
          <div className="text-sm text-slate-500">Loading steps…</div>
        ) : isError ? (
          <div className="text-sm text-red-500">Failed to load steps.</div>
        ) : subjectSteps.length === 0 ? (
          <div className="text-sm text-red-500">
            No steps configured for subject: {subject}
          </div>
        ) : (
          <StatusStepper
            steps={subjectSteps}
            currentKey={currentKey}
            onStepClick={handleStepClick}
          />
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">
            Device — {device?.name || device?.text || device?.id}
          </h3>
          <div className="text-base text-slate-500">{device.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: basic info */}
        <div className="col-span-1 space-y-4">
          <div>
            <label className="block text-base text-slate-500 mb-1">Name</label>
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full border rounded-md px-3 py-2 text-lg focus:outline-indigo-500"
                />
              ) : (
                <div
                  className="text-lg font-medium text-slate-900 truncate"
                  title={name || device?.text || ""}
                >
                  {name || "-"}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsEditingName((s) => !s)}
                className="p-2 rounded-md hover:bg-slate-100"
                aria-pressed={isEditingName}
                title={isEditingName ? "Finish editing" : "Edit name"}
              >
                {isEditingName ? (
                  <HiOutlineCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <HiOutlinePencilSquare className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base text-slate-500 mb-1">
              Will be energized
            </label>
            <DatePicker
              selected={willAt}
              onChange={(d) => setWillAt(d)}
              dateFormat="yyyy-MM-dd"
              isClearable
              className="w-full border rounded-md px-3 py-2 text-lg focus:outline-indigo-500 bg-white"
              placeholderText="Select a date"
            />
          </div>

          <div className="space-y-3">
            {/* Energized row */}
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-base font-medium ${
                    energized ? "text-indigo-700" : "text-slate-600"
                  }`}
                >
                  Energized
                </div>
                <div
                  className={`text-sm ${
                    energized ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  {energized ? "Energized" : "De-energized"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label
                  className="relative inline-flex items-center cursor-pointer"
                  aria-label="Toggle energized"
                >
                  <input
                    type="checkbox"
                    checked={energized}
                    onChange={(e) => setEnergized(e.target.checked)}
                    className="sr-only"
                    aria-checked={energized}
                  />
                  <span
                    className={`w-12 h-7 inline-block rounded-full transition-all duration-200 ${
                      energized ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                    aria-hidden
                  />
                </label>

                <div>
                  {energized ? (
                    <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Energized
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                      De-energized
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Energized Today row */}
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-base font-medium ${
                    energized
                      ? "text-slate-400"
                      : energizedToday
                        ? "text-indigo-700"
                        : "text-slate-600"
                  }`}
                >
                  Energized today
                </div>
                <div
                  className={`text-sm ${
                    energized
                      ? "text-slate-400"
                      : energizedToday
                        ? "text-indigo-600"
                        : "text-slate-500"
                  }`}
                >
                  {energized
                    ? "Already"
                    : energizedToday
                      ? "Energized Today"
                      : "Not Energized"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label
                  className={`relative inline-flex items-center cursor-pointer ${
                    energized ? "opacity-50 pointer-events-none" : ""
                  }`}
                  aria-label="Toggle energized today"
                  title={
                    energized
                      ? "Device already energized"
                      : "Toggle energized today"
                  }
                >
                  <input
                    type="checkbox"
                    checked={energized ? false : energizedToday}
                    onChange={(e) => setEnergizedToday(e.target.checked)}
                    className="sr-only"
                    aria-checked={energized ? false : energizedToday}
                    disabled={energized}
                  />
                  <span
                    className={`w-12 h-7 inline-block rounded-full transition-all duration-200 ${
                      energized
                        ? "bg-slate-200"
                        : energizedToday
                          ? "bg-indigo-600"
                          : "bg-slate-300"
                    }`}
                    aria-hidden
                  />
                </label>

                <div>
                  {energized ? (
                    <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                      Already
                    </div>
                  ) : energizedToday ? (
                    <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                      Energized Today
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                      Not Energized
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle + right column: comments + files */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-base text-slate-500 mb-1">
                Comments
              </label>
              <div className="text-sm text-slate-600">
                {showComments ? "Visible" : comments ? "Hidden" : "No comments"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle show/hide for comments */}
              <button
                type="button"
                onClick={() => setShowComments((s) => !s)}
                className="px-2 py-1 text-sm border rounded-md hover:bg-slate-100"
              >
                {showComments
                  ? "Hide comments"
                  : comments
                    ? "Show comments"
                    : "Add comment"}
              </button>
            </div>
          </div>

          {/* Conditionally render comments textarea */}
          {showComments && (
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full min-h-[80px] border rounded-md px-3 py-2 text-base resize-vertical focus:outline-indigo-500"
              placeholder="Add comments..."
            />
          )}

          {/* Files panel */}
          <div className="mt-0 bg-slate-50 border rounded-md p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <label className="text-base text-slate-600">Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm bg-white"
                >
                  <option value="panel_schedule">Panel schedule</option>
                  <option value="test_report">Test report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="device-file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="device-file-input"
                  className="inline-flex items-center px-3 py-1.5 border rounded-md cursor-pointer hover:bg-slate-100 text-sm"
                >
                  Choose
                </label>

                <Button
                  onClick={handleClickUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Uploading…" : "Upload"}
                </Button>
              </div>
            </div>

            <div className="mt-2 text-sm text-slate-600">
              {selectedFile
                ? selectedFile.name
                : uploadingFile
                  ? `Last uploaded: ${uploadingFile.name}`
                  : "No file selected"}
            </div>

            <div className="mt-3">
              {filesLoading && (
                <div className="text-sm text-slate-500">Loading files…</div>
              )}
              {filesError && (
                <div className="text-sm text-red-500">
                  Failed to load files.
                </div>
              )}

              {!filesLoading && files.length === 0 ? (
                <div className="text-sm text-slate-500">
                  No files uploaded for this device.
                </div>
              ) : (
                <ul className="divide-y mt-2 max-h-52 overflow-auto">
                  {files.map((file) => {
                    const isPreviewable =
                      file.mime_type?.startsWith("image/") ||
                      file.mime_type === "application/pdf";
                    return (
                      <li
                        key={file.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-base truncate">
                            {file.file_name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {file.file_type} ·{" "}
                            {(file.file_size / 1024).toFixed(1)} KB
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPreviewable && (
                            <button
                              onClick={() => handlePreview(file)}
                              className="p-1 rounded-md hover:bg-slate-100"
                              aria-label={`Preview ${file.file_name}`}
                            >
                              <HiEye className="w-5 h-5 text-slate-700" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDownload(file)}
                            className="p-1 rounded-md hover:bg-slate-100"
                            aria-label={`Download ${file.file_name}`}
                          >
                            <HiDocumentArrowDown className="w-5 h-5 text-slate-700" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end items-center gap-3">
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button onClick={save} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

DeviceEditor.propTypes = {
  device: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
