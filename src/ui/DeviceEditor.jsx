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
import Toggle from "./Toggle";
import { useDeviceFiles } from "../hooks/useDeviceFiles";
import { useUploadDeviceFile } from "../hooks/useUploadDeviceFile";
import { useSubjectSteps } from "../hooks/useSubjectSteps";

/**
 * StatusStepper
 * - steps: [{ key, label }]
 * - currentKey: 当前状态 key
 * - onStepClick?: (index, step) => void
 */
function StatusStepper({ steps = [], currentKey, onStepClick }) {
  const count = steps.length || 1;
  const rawIndex = steps.findIndex((s) => s.key === currentKey);
  const currentIndex = rawIndex >= 0 ? rawIndex : 0;

  return (
    <div className="w-full overflow-x-auto overflow-y-visible py-4">
      <style>{`
        @keyframes dashFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -16; }
        }
        @keyframes glowPulseLine {
          0%, 100% { opacity: .18; filter: drop-shadow(0 0 0 rgba(79,70,229,0)); }
          50%      { opacity: .35; filter: drop-shadow(0 0 6px rgba(79,70,229,.28)); }
        }
        @keyframes dotGlow {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(99,102,241,0.00),
              0 0 0 0 rgba(99,102,241,0.00);
          }
          50% {
            box-shadow:
              0 0 0 8px rgba(99,102,241,0.18),
              0 0 22px 4px rgba(99,102,241,0.28);
          }
        }
      `}</style>

      <div
        className="grid items-start gap-x-8 px-2"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => {
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
            <div
              key={`${step.key}-${i}`}
              className="flex flex-col items-center"
            >
              <div className="relative w-full flex items-center justify-center py-3">
                {hasNext && (
                  <svg
                    className="absolute left-1/2 top-1/2 w-full h-12 -translate-y-1/2 pointer-events-none"
                    viewBox="0 0 100 24"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
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

                    {segmentState === "current" && (
                      <g className="text-indigo-600">
                        <line
                          x1="10"
                          y1="12"
                          x2="95"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="7"
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

                <button
                  type="button"
                  onClick={() => onStepClick?.(i, step)}
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full text-2xl font-semibold transition-colors ${dotClass}`}
                  aria-current={isCurrent ? "step" : undefined}
                  style={
                    isCurrent
                      ? {
                          animation: "dotGlow 1.8s ease-in-out infinite",
                          transform: "scale(1.06)",
                          transition: "transform 200ms ease",
                        }
                      : undefined
                  }
                >
                  {isCompleted ? <HiOutlineCheck className="w-6 h-6" /> : i + 1}
                </button>
              </div>

              <div
                className={`mt-1 text-2xl text-center leading-snug max-w-[220px] ${textClass}`}
              >
                {step.label}
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

  const {
    data: stepsResp,
    isLoading: stepsLoading,
    isError: stepsError,
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

  if (!device) {
    return <div className="text-2xl text-gray-500 p-6">Loading device…</div>;
  }

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

  const handleStepClick = (index, step) => {
    console.log("step clicked", index, step);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-8 text-2xl">
      <div className="flex-1 min-h-0 overflow-auto">
        {/* Top: Stepper */}
        <div className="mb-6">
          {stepsLoading ? (
            <div className="text-xl text-slate-500">Loading steps…</div>
          ) : stepsError ? (
            <div className="text-xl text-red-500">Failed to load steps.</div>
          ) : subjectSteps.length === 0 ? (
            <div className="text-xl text-red-500">
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
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h3 className="text-4xl font-semibold text-slate-900">
              Device — {device?.name || device?.text || device?.id}
            </h3>
            <div className="text-xl text-slate-500">{device.id}</div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="col-span-1 space-y-6">
            <div>
              <label className="block text-xl text-slate-500 mb-2">Name</label>
              <div className="flex items-center gap-4">
                {isEditingName ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="w-full border rounded-md px-4 py-3 text-2xl focus:outline-indigo-500"
                  />
                ) : (
                  <div
                    className="text-2xl font-medium text-slate-900 truncate"
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
                    <HiOutlineCheck className="w-7 h-7 text-green-600" />
                  ) : (
                    <HiOutlinePencilSquare className="w-7 h-7 text-slate-700" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xl text-slate-500 mb-2">
                Will be energized
              </label>
              <DatePicker
                selected={willAt}
                onChange={(d) => setWillAt(d)}
                dateFormat="yyyy-MM-dd"
                isClearable
                className="w-full border rounded-md px-4 py-3 text-2xl focus:outline-indigo-500 bg-white"
                placeholderText="Select a date"
              />
            </div>

            <div className="space-y-5">
              {/* Energized row */}
              <div className="flex items-center justify-between gap-6">
                <div>
                  <div
                    className={`text-xl font-medium ${
                      energized ? "text-indigo-700" : "text-slate-600"
                    }`}
                  >
                    Energized
                  </div>
                  <div
                    className={`text-lg ${
                      energized ? "text-indigo-600" : "text-slate-500"
                    }`}
                  >
                    {energized ? "Energized" : "De-energized"}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Toggle
                    checked={energized}
                    onChange={(next) => setEnergized(next)}
                    size="md"
                    label="Toggle energized"
                  />
                </div>
              </div>

              {/* Energized Today row */}
              <div className="flex items-center justify-between gap-6">
                <div>
                  <div
                    className={`text-xl font-medium ${
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
                    className={`text-lg ${
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

                <div className="flex items-center gap-4">
                  <Toggle
                    checked={energized ? false : energizedToday}
                    onChange={(next) => setEnergizedToday(next)}
                    disabled={energized}
                    size="md"
                    label="Toggle energized today"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle + right column */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="block text-xl text-slate-500 mb-2">
                  Comments
                </label>
                <div className="text-lg text-slate-600">
                  {showComments
                    ? "Visible"
                    : comments
                      ? "Hidden"
                      : "No comments"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowComments((s) => !s)}
                  className="px-4 py-2 text-lg border rounded-md hover:bg-slate-100"
                >
                  {showComments
                    ? "Hide comments"
                    : comments
                      ? "Show comments"
                      : "Add comment"}
                </button>
              </div>
            </div>

            {showComments && (
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full min-h-[140px] border rounded-md px-4 py-3 text-2xl resize-vertical focus:outline-indigo-500"
                placeholder="Add comments..."
              />
            )}

            {/* Files panel */}
            <div className="mt-0 bg-slate-50 border rounded-md p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-xl text-slate-600">Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="border rounded-md px-3 py-2 text-lg bg-white"
                  >
                    <option value="panel_schedule">Panel schedule</option>
                    <option value="test_report">Test report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="device-file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="device-file-input"
                    className="inline-flex items-center px-4 py-2 border rounded-md cursor-pointer hover:bg-slate-100 text-lg"
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

              <div className="mt-3 text-lg text-slate-600">
                {selectedFile
                  ? selectedFile.name
                  : uploadingFile
                    ? `Last uploaded: ${uploadingFile.name}`
                    : "No file selected"}
              </div>

              <div className="mt-4">
                {filesLoading && (
                  <div className="text-lg text-slate-500">Loading files…</div>
                )}
                {filesError && (
                  <div className="text-lg text-red-500">
                    Failed to load files.
                  </div>
                )}

                {!filesLoading && files.length === 0 ? (
                  <div className="text-lg text-slate-500">
                    No files uploaded for this device.
                  </div>
                ) : (
                  <ul className="divide-y mt-3 max-h-64 overflow-auto">
                    {files.map((file) => {
                      const isPreviewable =
                        file.mime_type?.startsWith("image/") ||
                        file.mime_type === "application/pdf";
                      return (
                        <li
                          key={file.id}
                          className="flex items-center justify-between py-3 gap-4"
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-xl truncate">
                              {file.file_name}
                            </div>
                            <div className="text-lg text-slate-500">
                              {file.file_type} ·{" "}
                              {(file.file_size / 1024).toFixed(1)} KB
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {isPreviewable && (
                              <button
                                onClick={() => handlePreview(file)}
                                className="p-2 rounded-md hover:bg-slate-100"
                                aria-label={`Preview ${file.file_name}`}
                              >
                                <HiEye className="w-7 h-7 text-slate-700" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDownload(file)}
                              className="p-2 rounded-md hover:bg-slate-100"
                              aria-label={`Download ${file.file_name}`}
                            >
                              <HiDocumentArrowDown className="w-7 h-7 text-slate-700" />
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
      </div>

      {/* Actions 固定在底部 */}
      <div className="pt-6 flex justify-end items-center gap-4 border-t">
        {/* 你 Button 组件里 prop 名是 variation，不是 variant。
           如果 secondary 没生效，把下面改成 variation="secondary" */}
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
