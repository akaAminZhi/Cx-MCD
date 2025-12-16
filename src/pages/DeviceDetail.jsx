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
} from "react-icons/hi2";
import { PiPlugsConnectedBold } from "react-icons/pi";
import { format, formatDistanceToNow } from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router";
import { useMemo } from "react";
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
    <div className="grid grid-cols-[18rem_1fr] gap-6 items-start py-3">
      <div className="text-slate-500 text-lg font-semibold">{label}</div>
      <div className="text-xl text-slate-900 flex flex-wrap gap-3 items-center">
        {children}
      </div>
    </div>
  );
}

function DeviceDetail() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const stateDevice = state?.device;

  const { data: device, isLoading, error } = useDevice(deviceId, {
    initialData: stateDevice,
  });

  const {
    data: filesData,
    isLoading: filesLoading,
    error: filesError,
  } = useDeviceFiles(deviceId);

  const files = filesData?.data ?? [];
  const fileCount = filesData?.count ?? files.length;

  const meta = useMemo(() => (device ? getFilePageMeta(device) : null), [device]);

  if (isLoading || !device) return <Spinner />;

  if (error)
    return (
      <div className="text-red-600 text-2xl p-10">Failed to load: {error.message}</div>
    );

  const updatedAgo = device.updated_at
    ? formatDistanceToNow(new Date(device.updated_at), { addSuffix: true })
    : null;

  const createdAt = device.created_at
    ? format(new Date(device.created_at), "MMM d, yyyy HH:mm")
    : "-";

  const willAt = device.will_energized_at
    ? format(new Date(device.will_energized_at), "MMM d, yyyy HH:mm")
    : "Not scheduled";

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
              {meta && <InfoPill icon={meta.icon} label={meta.label} tone={meta.tone} />}

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
            <h3 className="text-xl font-semibold text-slate-800">Energization</h3>
            <p className="text-lg text-slate-700">{device.comments || "No comments."}</p>
            <p className="flex items-center gap-2 text-lg text-slate-700">
              <HiClock className="w-5 h-5 text-emerald-600" /> {willAt}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-inner space-y-3">
            <h3 className="text-xl font-semibold text-slate-800">Geometry</h3>
            <p className="text-lg text-slate-700">
              Rect PX: {device.rect_px?.length ? device.rect_px.join(", ") : "-"}
            </p>
            <p className="text-lg text-slate-700">
              Segments: {device.short_segments_px ? "Provided" : "Not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-10 space-y-6">
        <Heading Tag="h2" className="text-3xl font-semibold text-slate-900">
          Key details
        </Heading>

        <div className="divide-y divide-slate-100">
          <DataRow label="Project / Page">
            <InfoPill
              icon={<HiOutlineDocumentText className="w-6 h-6" />}
              label={`${device.project || "-"} · Page ${device.file_page}`}
              tone="bg-slate-50 text-slate-800 border-slate-200"
            />
          </DataRow>

          <DataRow label="Text">
            <span className="text-xl font-semibold text-slate-900">
              {device.text || "-"}
            </span>
          </DataRow>

          <DataRow label="Subject">
            <span className="text-xl text-slate-800">{device.subject || "-"}</span>
          </DataRow>

          <DataRow label="Schedule">
            <InfoPill
              icon={<HiCalendarDays className="w-6 h-6" />}
              label={willAt}
              tone="bg-indigo-50 text-indigo-800 border-indigo-200"
            />
          </DataRow>

          <DataRow label="Comments">
            <span className="text-lg leading-relaxed text-slate-700">
              {device.comments || "No comments yet."}
            </span>
          </DataRow>
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
          <div className="text-lg text-slate-600">No files uploaded for this device.</div>
        )}

        {files.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[2fr_1fr_1fr_10rem] bg-slate-100 text-slate-700 text-lg font-semibold px-6 py-3">
              <span>File</span>
              <span>Type</span>
              <span>Uploaded</span>
              <span className="text-right pr-2">Size</span>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-[2fr_1fr_1fr_10rem] items-center px-6 py-4 text-lg text-slate-800"
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
                  <span className="text-right flex items-center justify-end gap-3">
                    <span className="text-slate-700">
                      {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "-"}
                    </span>
                    <a
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-base inline-flex items-center gap-2 hover:bg-indigo-700"
                      href={`/api/v1/files/${file.id}`}
                    >
                      <HiDocumentArrowDown className="w-5 h-5" /> Download
                    </a>
                  </span>
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
