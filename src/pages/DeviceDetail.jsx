import {
  HiArrowLeft,
  HiBolt,
  HiBoltSlash,
  HiCalendarDays,
  HiClock,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiMiniArrowTrendingUp,
  HiDocumentArrowDown,
  HiEye,
  HiArrowPath,
} from "react-icons/hi2";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { format, formatDistanceToNow } from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import useDevice from "../hooks/useDevice";
import { useDeviceFiles } from "../hooks/useDeviceFiles";
import Spinner from "../ui/Spinner";
import Heading from "../ui/Heading";

function getFilePageMeta(device) {
  if (device.project === "lsb") {
    if (device.file_page === 1)
      return {
        label: "Normal",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <PiPlugsConnectedBold className="w-6 h-6" />,
      };
    if (device.file_page === 2)
      return {
        label: "Emergency",
        tone: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <HiBolt className="w-6 h-6" />,
      };
  }
  return {
    label: `Page ${device.file_page}`,
    tone: "bg-slate-50 text-slate-700 border-slate-200",
    icon: <HiOutlineDocumentText className="w-6 h-6" />,
  };
}

function InfoPill({ icon, label, tone }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-lg font-medium ${tone}`}
    >
      {icon}
      {label}
    </span>
  );
}

function DataRow({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-slate-500 text-lg font-semibold">{label}</div>
      <div className="text-xl text-slate-900 flex flex-wrap gap-3 items-center">
        {children}
      </div>
    </div>
  );
}

function formatDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  // Align to local timezone for input[type=datetime-local]
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function DeviceDetail() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const stateDevice = state?.device;

  const {
    data: device,
    isLoading,
    error,
  } = useDevice(deviceId, {
    initialData: stateDevice,
  });

  const {
    data: filesData,
    isLoading: filesLoading,
    error: filesError,
  } = useDeviceFiles(deviceId);

  const [text, setText] = useState("");
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");
  const [willAt, setWillAt] = useState("");
  const [energized, setEnergized] = useState(false);
  const [energizedToday, setEnergizedToday] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  useEffect(() => {
    if (!device) return;
    setText(device.text || "");
    setSubject(device.subject || "");
    setComments(device.comments || "");
    setWillAt(formatDateTimeLocal(device.will_energized_at));
    setEnergized(!!device.energized);
    setEnergizedToday(!!device.energized_today);
    setFromLocation(device.from || device.computed_from || "");
    setToLocation(device.to || device.computed_to || "");
  }, [device]);

  const qc = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.put(`/api/v1/devices/${deviceId}`, payload);
      return res.data;
    },
    onSuccess: (updated) => {
      qc.setQueryData(["device", deviceId], updated?.data || updated);
      qc.invalidateQueries({ queryKey: ["deviceFiles", deviceId] });
      toast.success("Device updated");
    },
    onError: () => toast.error("Failed to update device"),
  });

  const files = filesData?.data ?? [];
  const fileCount = filesData?.count ?? files.length;

  const meta = useMemo(
    () => (device ? getFilePageMeta(device) : null),
    [device]
  );

  if (isLoading || !device) return <Spinner />;

  if (error)
    return (
      <div className="text-red-600 text-2xl p-10">
        Failed to load: {error.message}
      </div>
    );

  const updatedAgo = device.updated_at
    ? formatDistanceToNow(new Date(device.updated_at), { addSuffix: true })
    : null;

  const createdAt = device.created_at
    ? format(new Date(device.created_at), "MMM d, yyyy HH:mm")
    : "-";

  const willAtDisplay = device.will_energized_at
    ? format(new Date(device.will_energized_at), "MMM d, yyyy HH:mm")
    : "Not scheduled";

  const handleSave = () => {
    updateMutation.mutate({
      text,
      subject,
      comments,
      energized,
      energized_today: energized ? false : energizedToday,
      will_energized_at: willAt ? new Date(willAt).toISOString() : null,
      from: fromLocation,
      to: toLocation,
    });
  };

  const handleDownload = async (file) => {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.file_name || "download";
      a.click();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      toast.error("Download failed");
    }
  };

  const handlePreview = async (file) => {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(res.data);
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      toast.error("Preview failed");
    }
  };

  return (
    <div className="space-y-10 text-lg pb-20">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-3 text-xl font-semibold text-indigo-700 px-5 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100"
        >
          <HiArrowLeft className="w-6 h-6" /> Back to dashboard
        </button>

        <InfoPill
          icon={<HiOutlineMapPin className="w-6 h-6" />}
          label={`Device ID: ${device.id}`}
          tone="bg-white text-slate-800 border-slate-200 shadow-sm"
        />
      </div>

      {/* Header */}
      <div className="rounded-3xl border border-indigo-100 bg-white shadow-lg p-10 space-y-6">
        <div className="flex flex-wrap justify-between gap-6 items-start">
          <div className="space-y-2">
            <Heading Tag="h1" className="text-4xl font-bold text-slate-900">
              {device.text || device.subject || "Device"}
            </Heading>
            <p className="text-2xl text-slate-600 max-w-3xl">
              {device.subject || "No subject provided."}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {meta && (
                <InfoPill
                  icon={meta.icon}
                  label={meta.label}
                  tone={meta.tone}
                />
              )}

              <InfoPill
                icon={
                  device.energized ? (
                    <HiBolt className="w-6 h-6" />
                  ) : (
                    <HiBoltSlash className="w-6 h-6" />
                  )
                }
                label={device.energized ? "Energized" : "Not energized"}
                tone={
                  device.energized
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }
              />

              {device.energized_today && (
                <InfoPill
                  icon={<HiMiniArrowTrendingUp className="w-5 h-5" />}
                  label="Active today"
                  tone="bg-indigo-50 text-indigo-700 border-indigo-200"
                />
              )}

              <InfoPill
                icon={<HiCalendarDays className="w-6 h-6" />}
                label={`Files: ${filesLoading ? "…" : fileCount}`}
                tone="bg-slate-50 text-slate-700 border-slate-200"
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right text-slate-600 text-lg">
            <p>Project: {device.project?.toUpperCase?.() || device.project}</p>
            <p>Created: {createdAt}</p>
            {updatedAgo && <p>Last updated {updatedAgo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-inner space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Route</h3>
            <p className="flex items-center gap-3 text-lg text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              From: {device.computed_from || device.from || "N/A"}
            </p>
            <p className="flex items-center gap-3 text-lg text-slate-700">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              To: {device.computed_to || device.to || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-inner space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">
              Energization
            </h3>
            <p className="text-lg text-slate-700">
              {device.comments || "No comments."}
            </p>
            <p className="flex items-center gap-2 text-lg text-slate-700">
              <HiClock className="w-5 h-5 text-emerald-600" />
              {willAt
                ? format(new Date(willAt), "MMM d, yyyy HH:mm")
                : willAtDisplay}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-inner space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Geometry</h3>
            <p className="text-lg text-slate-700">
              Rect PX:{" "}
              {device.rect_px?.length ? device.rect_px.join(", ") : "-"}
            </p>
            <p className="text-lg text-slate-700">
              Segments:{" "}
              {device.short_segments_px ? "Provided" : "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading Tag="h2" className="text-3xl font-semibold text-slate-900">
            Key details
          </Heading>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-3 rounded-2xl bg-indigo-600 text-white px-6 py-3 text-xl font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            <HiArrowPath className="w-6 h-6" />
            {updateMutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <DataRow label="Project / Page">
                <InfoPill
                  icon={<HiOutlineDocumentText className="w-6 h-6" />}
                  label={`${device.project || "-"} · Page ${device.file_page}`}
                  tone="bg-slate-50 text-slate-800 border-slate-200"
                />
              </DataRow>

              <DataRow label="Identifier">
                <InfoPill
                  icon={<HiOutlineMapPin className="w-6 h-6" />}
                  label={device.id}
                  tone="bg-white text-slate-900 border-slate-200 shadow-sm"
                />
              </DataRow>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <DataRow label="Text">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter display text"
                />
              </DataRow>

              <DataRow label="Subject">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Enter subject"
                />
              </DataRow>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <DataRow label="Route">
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-sm uppercase text-slate-500">
                      From
                    </span>
                    <input
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Origin"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm uppercase text-slate-500">To</span>
                    <input
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Destination"
                    />
                  </div>
                </div>
              </DataRow>

              <DataRow label="Schedule">
                <div className="flex flex-col gap-3">
                  <input
                    type="datetime-local"
                    value={willAt}
                    onChange={(e) => setWillAt(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                  />
                  <span className="text-base text-slate-500">
                    {device.will_energized_at
                      ? `Currently ${willAtDisplay}`
                      : "Not scheduled"}
                  </span>
                </div>
              </DataRow>
            </div>

            <DataRow label="Comments">
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg leading-relaxed focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                placeholder="Add context for this device"
              />
            </DataRow>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-inner space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">Status</h3>
              <label className="flex items-center gap-4 text-lg">
                <input
                  type="checkbox"
                  checked={energized}
                  onChange={(e) => setEnergized(e.target.checked)}
                  className="h-6 w-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-800">
                  {energized ? "Energized" : "Not energized"}
                </span>
              </label>

              <label className="flex items-center gap-4 text-lg">
                <input
                  type="checkbox"
                  checked={energizedToday}
                  disabled={energized}
                  onChange={(e) => setEnergizedToday(e.target.checked)}
                  className="h-6 w-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                <span className="text-slate-700">Active today</span>
              </label>

              <div className="flex items-center gap-3 text-lg text-slate-700 pt-2">
                <HiCalendarDays className="w-5 h-5 text-indigo-500" />
                <span>
                  {willAt
                    ? format(new Date(willAt), "MMM d, yyyy HH:mm")
                    : "No schedule"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-slate-800">
                At a glance
              </h3>
              <div className="flex items-center justify-between text-lg text-slate-700">
                <span>Files</span>
                <span className="font-semibold">
                  {filesLoading ? "…" : fileCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg text-slate-700">
                <span>Created</span>
                <span>{createdAt}</span>
              </div>
              {updatedAgo && (
                <div className="flex items-center justify-between text-lg text-slate-700">
                  <span>Updated</span>
                  <span>{updatedAgo}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-10 space-y-6">
        <div className="flex items-center gap-3">
          <Heading Tag="h2" className="text-3xl font-semibold text-slate-900">
            Associated files
          </Heading>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-lg">
            {filesLoading ? "Loading…" : `${fileCount} file(s)`}
          </span>
        </div>

        {filesError && (
          <div className="text-red-600 text-lg">Failed to load files.</div>
        )}

        {filesLoading && <Spinner />}

        {!filesLoading && files.length === 0 && (
          <div className="text-lg text-slate-600">
            No files uploaded for this device.
          </div>
        )}

        {files.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-slate-100 text-slate-700 text-lg font-semibold px-6 py-3">
              <span>File</span>
              <span>Type</span>
              <span>Uploaded</span>
              <span className="text-right pr-2">Actions</span>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 text-lg text-slate-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HiOutlineDocumentText className="w-6 h-6 text-indigo-600 shrink-0" />
                    <span className="truncate" title={file.file_name}>
                      {file.file_name}
                    </span>
                  </div>
                  <span className="font-medium uppercase text-slate-600">
                    {file.file_type || "-"}
                  </span>
                  <span className="text-slate-600">
                    {file.created_at
                      ? format(new Date(file.created_at), "MMM d, yyyy")
                      : "-"}
                  </span>
                  <div className="text-right flex items-center justify-end gap-3">
                    {(file.mime_type?.startsWith("image/") ||
                      file.mime_type === "application/pdf") && (
                      <button
                        onClick={() => handlePreview(file)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <HiEye className="w-10 h-10" /> View
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(file)}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-base font-semibold text-white shadow hover:bg-indigo-700"
                    >
                      <HiDocumentArrowDown className="w-10 h-10" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeviceDetail;
