import { useEffect, useMemo, useState } from "react";
import { PiPlugsConnectedBold } from "react-icons/pi";
import {
  HiBolt,
  HiCalendarDays,
  HiBoltSlash,
  HiFire,
  HiMagnifyingGlass,
  HiMiniArrowTrendingUp,
  HiOutlineDocumentText,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { format, formatDistanceToNow, isAfter, subHours } from "date-fns";
import { useNavigate } from "react-router";
import Heading from "../../ui/Heading";
import { useProjectEquipments } from "../../hooks/useProjectEquipments";
import Spinner from "../../ui/Spinner";
import { useDeviceFiles } from "../../hooks/useDeviceFiles";
// import Modal, { useModal } from "../../ui/Modal";
import DeviceEditor from "../../ui/DeviceEditor";

// ======================================================
// 🔧 Unified Typography Scale
// ======================================================

// helper: status meta
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
        icon: <HiFire className="w-6 h-6" />,
      };
  }
  return {
    label: `Page ${device.file_page}`,
    tone: "bg-slate-50 text-slate-700 border-slate-200",
    icon: <HiOutlineDocumentText className="w-6 h-6" />,
  };
}

// ======================================================
// Summary Card Component (Revised Typography)
// ======================================================
function SummaryCard({ title, value, icon, tone }) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm bg-white flex items-center gap-6 ${tone}`}
    >
      <div className="rounded-2xl bg-white/90 p-4 shadow-inner text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-base uppercase tracking-[0.15em]">
          {title}
        </p>
        <p className="text-4xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

// ======================================================
// DeviceCard Component (Unified Typography)
// ======================================================
function DeviceCard({ device }) {
  const meta = getFilePageMeta(device);

  const updatedAgo = formatDistanceToNow(new Date(device.updated_at), {
    addSuffix: true,
  });

  const scheduled = device.will_energized_at
    ? format(new Date(device.will_energized_at), "MMM d, HH:mm")
    : null;

  const {
    data: filesData,
    isLoading: isFilesLoading,
    error: filesError,
  } = useDeviceFiles(device.id);

  const fileCount = filesError ? "?" : (filesData?.count ?? 0);

  const baseCardClasses = `
    group relative border rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-5 overflow-hidden
    transition-all duration-200 ease-out cursor-pointer
    hover:-translate-y-1 hover:shadow-xl
    focus-within:-translate-y-1 focus-within:shadow-xl
  `;

  const energizedTone = device.energized
    ? "energized-surge border-rose-300 hover:border-rose-400 focus-within:border-rose-500 hover:bg-rose-50/50"
    : "hover:border-indigo-300 focus-within:border-indigo-400 hover:bg-indigo-50/40";

  const accentBar = device.energized
    ? "bg-rose-500/90 shadow-[0_0_12px_rgba(248,113,113,0.85)]"
    : "bg-indigo-400/80";

  return (
    <article className={`${baseCardClasses.trim()} ${energizedTone}`.trim()}>
      <span
        className={`
          absolute inset-y-4 left-0 w-1 rounded-r-2xl opacity-0
          group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ${accentBar}
        `}
      />

      <header className="flex justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-slate-400 tracking-wide">
            {device.project}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900 mt-1">
            {device.text}
          </h3>
          <p className="text-base text-slate-600 mt-1 line-clamp-2">
            {device.subject}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <span
            className={`inline-flex items-center gap-2 text-base border px-3 py-1.5 rounded-full ${meta.tone}`}
          >
            {meta.icon}
            {meta.label}
          </span>

          <span
            className={`inline-flex items-center gap-2 text-base px-3 py-1.5 rounded-full border ${
              device.energized
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {device.energized ? (
              <HiBolt className="w-5 h-5" />
            ) : (
              <HiBoltSlash className="w-5 h-5" />
            )}

            {device.energized ? "Energized" : "Not energized"}
          </span>

          {device.energized_today && (
            <span className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1 inline-flex items-center gap-1">
              <HiMiniArrowTrendingUp className="w-4 h-4" /> Today active
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 text-base text-slate-700">
        <div className="flex items-center gap-2">
          <HiOutlineMapPin className="w-5 h-5 text-indigo-500" />
          <span className="font-medium truncate">{device.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <HiOutlineDocumentText className="w-5 h-5 text-indigo-500" />
          <span>
            {meta.label} ·{" "}
            {device.file_page === 1 ? "Page 1" : `Page ${device.file_page}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="truncate">From: {device.computed_from}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="truncate">To: {device.computed_to}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
          Updated {updatedAgo}
        </span>
        <span className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-100 rounded-full">
          Files: {isFilesLoading ? "…" : fileCount}
        </span>
        {scheduled && (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full flex items-center gap-1">
            <HiCalendarDays className="w-4 h-4" /> {scheduled}
          </span>
        )}
      </div>
    </article>
  );
}

// ======================================================
// MAIN DASHBOARD PAGE (Unified Typography)
// ======================================================
function LSB_Dashboard_Page() {
  const [pageFilter, setPageFilter] = useState("all");
  const [energizedFilter, setEnergizedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 9;
  //   const { open } = useModal();
  const projectId = "lsb";

  const navigate = useNavigate();

  const { data, isLoading, error } = useProjectEquipments(projectId);
  const Equipement = data?.data ?? [];

  // ===== filtering logic =====
  const filteredAll = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return Equipement.filter((device) => {
      if (
        pageFilter === "normal" &&
        !(device.project === "lsb" && device.file_page === 1)
      )
        return false;
      if (
        pageFilter === "emergency" &&
        !(device.project === "lsb" && device.file_page === 2)
      )
        return false;
      if (energizedFilter === "on" && !device.energized) return false;
      if (energizedFilter === "off" && device.energized) return false;
      if (!term) return true;

      return (
        device.id.toLowerCase().includes(term) ||
        device.subject.toLowerCase().includes(term) ||
        device.text.toLowerCase().includes(term)
      );
    });
  }, [Equipement, pageFilter, energizedFilter, searchTerm]);

  const totalCount = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAll.slice(start, start + pageSize);
  }, [filteredAll, page]);

  // ===== summary =====
  const summary = useMemo(() => {
    return {
      total: Equipement.length,
      energized: Equipement.filter((d) => d.energized).length,
      today: Equipement.filter((d) => d.energized_today).length,
      normal: Equipement.filter((d) => d.file_page === 1).length,
      emergency: Equipement.filter((d) => d.file_page === 2).length,
      upcoming: Equipement.filter(
        (d) =>
          d.will_energized_at &&
          isAfter(new Date(d.will_energized_at), subHours(new Date(), 1))
      ).length,
    };
  }, [Equipement]);

  const isInitialLoading = isLoading && !data;
  if (isInitialLoading) return <Spinner />;

  if (error)
    return (
      <div className="text-red-600 text-xl p-10">
        Failed to load: {error.message}
      </div>
    );

  // ==================================================
  // MAIN RENDER
  // ==================================================
  return (
    <div className="flex flex-col gap-10 text-lg pb-16">
      {/* Page Title */}
      <header>
        <Heading Tag="h1" className="text-4xl font-bold text-slate-900">
          Device Dashboard
        </Heading>
      </header>

      {/* Summary Cards */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          title="Total Devices"
          value={summary.total}
          icon={<HiOutlineDocumentText className="w-8 h-8" />}
          tone="border-slate-200"
        />
        <SummaryCard
          title="Energized"
          value={summary.energized}
          icon={<HiBolt className="w-8 h-8" />}
          tone="border-emerald-200 bg-emerald-50/40"
        />
        <SummaryCard
          title="Today Active"
          value={summary.today}
          icon={<HiMiniArrowTrendingUp className="w-8 h-8" />}
          tone="border-indigo-200 bg-indigo-50/40"
        />
        <SummaryCard
          title="Normal (LSB)"
          value={summary.normal}
          icon={<PiPlugsConnectedBold className="w-8 h-8" />}
          tone="border-emerald-100 bg-emerald-50/40"
        />
        <SummaryCard
          title="Emergency (LSB)"
          value={summary.emergency}
          icon={<HiFire className="w-8 h-8" />}
          tone="border-rose-100 bg-rose-50/40"
        />
        <SummaryCard
          title="Scheduled"
          value={summary.upcoming}
          icon={<HiCalendarDays className="w-8 h-8" />}
          tone="border-amber-100 bg-amber-50/40"
        />
      </section>

      {/* FILTER + SEARCH + PAGINATION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-5">
        {/* TOP FILTERS */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* SEARCH */}
            <label className="relative">
              <HiMagnifyingGlass className="w-7 h-7 text-slate-400 absolute left-4 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by ID / subject / text"
                className="
                  pl-14 pr-4 py-3 border rounded-xl text-lg w-80
                  focus:outline focus:outline-2 focus:outline-indigo-500
                "
              />
            </label>

            {/* PAGE FILTER */}
            <select
              value={pageFilter}
              onChange={(e) => {
                setPageFilter(e.target.value);
                setPage(1);
              }}
              className="
                border rounded-xl px-4 py-2 text-lg
                focus:outline focus:outline-2 focus:outline-indigo-500
              "
            >
              <option value="all">All pages</option>
              <option value="normal">Normal (LSB)</option>
              <option value="emergency">Emergency (LSB)</option>
            </select>

            {/* ENERGY FILTER */}
            <select
              value={energizedFilter}
              onChange={(e) => {
                setEnergizedFilter(e.target.value);
                setPage(1);
              }}
              className="
                border rounded-xl px-4 py-2 text-lg
                focus:outline focus:outline-2 focus:outline-indigo-500
              "
            >
              <option value="all">All energy states</option>
              <option value="on">Energized</option>
              <option value="off">Not energized</option>
            </select>
          </div>

          {/* HINT CHIPS */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              LSB Page 1 → Normal
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              LSB Page 2 → Emergency
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
              Other pages keep original numbers
            </span>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between text-lg text-slate-600">
          <p>
            Showing{" "}
            <strong className="text-slate-900">{pagedDevices.length}</strong> of{" "}
            {totalCount} matched devices (project total {summary.total})
          </p>

          <div className="flex gap-3 text-lg font-semibold">
            <button
              className="px-4 py-2 rounded-xl border border-slate-300 disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span className="px-2 py-1 text-slate-700">
              Page {page} / {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded-xl border border-slate-300 disabled:opacity-40"
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* DEVICE GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pagedDevices.map((device) => (
          <button
            key={device.id}
            className="text-left"
            onClick={() => {
              navigate(`/devices/${device.id}`, { state: { device } });
            }}
          >
            <DeviceCard device={device} />
          </button>
        ))}

        {pagedDevices.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-2xl p-16 text-center text-slate-500 bg-white text-xl">
            No devices match current filters.
          </div>
        )}
      </section>

      {/* EDIT MODAL */}
      {/* <Modal.Window name="device-editor" size="xl">
        {({ closeModal }) => (
          <DeviceEditor
            device={activeDevice}
            projectId={projectId}
            closeModal={closeModal}
          />
        )}
      </Modal.Window> */}
    </div>
  );
}

export default LSB_Dashboard_Page;
