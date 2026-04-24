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
import { format, formatDistanceToNow } from "date-fns";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import Heading from "../../ui/Heading";
import { useProjectEquipments } from "../../hooks/useProjectEquipments";
import Spinner from "../../ui/Spinner";

// ======================================================
// helper: status meta
function getFilePageMeta(device) {
  if (device.project === "lsb") {
    if (device.file_page === 1)
      return {
        label: "Normal Power",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <PiPlugsConnectedBold className="w-6 h-6" />,
      };
    if (device.file_page === 2)
      return {
        label: "Emergency Power",
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
// Summary Card
function SummaryCard({ title, value, icon, tone }) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm bg-white flex items-center gap-6 ${tone}`}
    >
      <div className="rounded-2xl bg-white/90 p-4 shadow-inner text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-lg uppercase tracking-[0.15em]">
          {title}
        </p>
        <p className="text-5xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function FocusCard({ title, value, subtitle, icon, tone, details }) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm bg-white flex flex-col gap-6 ${tone}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-lg uppercase tracking-[0.15em]">{title}</p>
          <p className="text-6xl font-semibold text-slate-900 mt-2">{value}</p>
          {subtitle && <p className="text-lg text-slate-600 mt-2">{subtitle}</p>}
        </div>
        <div className="rounded-2xl bg-white/90 p-4 shadow-inner text-indigo-600">{icon}</div>
      </div>

      {details ? <div className="border-t border-slate-200 pt-4">{details}</div> : null}
    </div>
  );
}

// ======================================================
// DeviceCard
function DeviceCard({ device }) {
  const meta = getFilePageMeta(device);

  const updatedAgo = formatDistanceToNow(new Date(device.updated_at), {
    addSuffix: true,
  });

  const scheduled = device.will_energized_at
    ? format(new Date(device.will_energized_at), "MMM d, HH:mm")
    : null;

  const baseCardClasses = `
    group relative border rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-5 overflow-hidden
    transition-all duration-200 ease-out cursor-pointer
    hover:-translate-y-1 hover:shadow-xl
    focus-within:-translate-y-1 focus-within:shadow-xl
  `;

  const energizedTone = device.energized
    ? " border-rose-300 hover:border-rose-400 focus-within:border-rose-500 hover:bg-rose-50/50"
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
          <p className="text-base uppercase text-slate-400 tracking-wide">
            {device.project}
          </p>
          <h3 className="text-3xl font-semibold text-slate-900 mt-1">
            {device.text}
          </h3>
          <p className="text-lg text-slate-600 mt-1 line-clamp-2">
            {device.subject}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2.5">
          <span
            className={`inline-flex items-center gap-2 text-lg border px-3 py-1.5 rounded-full ${meta.tone}`}
          >
            {meta.icon}
            {meta.label}
          </span>

          <span
            className={`inline-flex items-center gap-2 text-lg px-3 py-1.5 rounded-full border ${
              device.energized
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {device.energized ? (
              <HiBolt className="w-5 h-5 icon-jump-pulse" />
            ) : (
              <HiBoltSlash className="w-5 h-5" />
            )}
            {device.energized ? "Energized" : "Not energized"}
          </span>

          {device.energized_today && (
            <span className="text-base bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1 inline-flex items-center gap-1">
              <HiMiniArrowTrendingUp className="w-4 h-4" /> Today active
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 text-lg text-slate-700">
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

      <div className="flex flex-wrap gap-2 text-base text-slate-600">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
          Updated {updatedAgo}
        </span>
        <span className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-100 rounded-full">
          Files: {device.file_count ?? 0}
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
// MAIN DASHBOARD PAGE
function LSB_Dashboard_Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const projectId = "lsb";

  // read from url (initial)
  const initialSearch = searchParams.get("q") ?? "";
  const initialPageFilter = searchParams.get("pageFilter") ?? "all";
  const initialEnergizedFilter = searchParams.get("energized") ?? "all";
  const initialSubjectFilter = searchParams.get("subject") ?? "all";
  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [pageFilter, setPageFilter] = useState(initialPageFilter);
  const [energizedFilter, setEnergizedFilter] = useState(
    initialEnergizedFilter
  );
  const [subjectFilter, setSubjectFilter] = useState(initialSubjectFilter);
  const [page, setPage] = useState(
    Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1
  );

  // UI page size and server size kept same for simplicity
  const pageSize = 9;

  // debounce update url params
  useEffect(() => {
    const t = setTimeout(() => {
      const params = {};

      if (searchTerm) params.q = searchTerm;
      if (pageFilter && pageFilter !== "all") params.pageFilter = pageFilter;
      if (energizedFilter && energizedFilter !== "all")
        params.energized = energizedFilter;
      if (subjectFilter && subjectFilter !== "all")
        params.subject = subjectFilter;
      if (page && page !== 1) params.page = String(page);

      setSearchParams(params, { replace: true });
    }, 350);

    return () => clearTimeout(t);
  }, [
    searchTerm,
    pageFilter,
    energizedFilter,
    subjectFilter,
    page,
    setSearchParams,
  ]);

  // ✅ fetch from server with filters + paging
  const { data, isLoading, error } = useProjectEquipments(projectId, {
    page,
    size: pageSize,
    q: searchTerm,
    pageFilter,
    energized: energizedFilter,
    subject: subjectFilter,
  });

  const equipments = data?.data ?? [];

  const activeStats = useMemo(
    () =>
      data?.active_stats ?? {
        today: 0,
        week: 0,
        month: 0,
      },
    [data]
  );

  // totals from server
  const totalCount = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // keep page in range
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // ✅ summary from server (overall, not filtered)
  const summary = data?.summary ?? {
    total: 0,
    energized: 0,
    today: 0,
    normal: 0,
    emergency: 0,
    upcoming: 0,
  };

  // subject options: temporary (current page only)
  const subjectOptions = useMemo(() => {
    // 优先用后端返回的 subject_options（完整）
    const fromServer = data?.subject_options;
    if (Array.isArray(fromServer) && fromServer.length > 0) return fromServer;

    // fallback：当前页内的 subjects（不完整）
    const set = new Set();
    for (const d of equipments) {
      const s = (d.subject ?? "").trim();
      if (s) set.add(s);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data, equipments]);

  const isInitialLoading = isLoading && !data;
  if (isInitialLoading) return <Spinner />;

  if (error)
    return (
      <div className="text-red-600 text-2xl p-10">
        Failed to load: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-10 text-xl pb-16">
      <header>
        <Heading Tag="h1" className="text-5xl font-bold text-slate-900">
          Device Dashboard
        </Heading>
      </header>

      {/* Summary Cards (focused + secondary) */}
      <section className="flex flex-col gap-6">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <FocusCard
            title="Energized"
            value={summary.energized}
            subtitle={`Scheduled ${summary.upcoming}`}
            icon={<HiBolt className="w-10 h-10 icon-jump-pulse" />}
            tone="border-rose-200 bg-rose-50/50"
          />

          <FocusCard
            title="Scheduled Active"
            value={activeStats.month}
            subtitle="Today / This week / This month"
            icon={<HiMiniArrowTrendingUp className="w-10 h-10" />}
            tone="border-indigo-200 bg-indigo-50/50"
            details={
              <div className="flex flex-wrap gap-3 text-lg">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Today {activeStats.today}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  This week {activeStats.week}
                </span>
                <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                  This month {activeStats.month}
                </span>
              </div>
            }
          />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Devices"
            value={summary.total}
            icon={<HiOutlineDocumentText className="w-8 h-8" />}
            tone="border-slate-200"
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
        </div>
      </section>

      {/* FILTER + SEARCH + PAGINATION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-5">
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
                  pl-14 pr-4 py-3 border rounded-xl text-xl w-80
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
                border rounded-xl px-4 py-2 text-xl
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
                border rounded-xl px-4 py-2 text-xl
                focus:outline focus:outline-2 focus:outline-indigo-500
              "
            >
              <option value="all">All energy states</option>
              <option value="on">Energized</option>
              <option value="off">Not energized</option>
            </select>

            {/* SUBJECT FILTER */}
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setPage(1);
              }}
              className="
                border rounded-xl px-4 py-2 text-xl
                focus:outline focus:outline-2 focus:outline-indigo-500
              "
            >
              <option value="all">All subjects</option>
              {subjectOptions
                .filter((s) => s !== "all")
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between text-xl text-slate-600">
            <p>
              Showing{" "}
              <strong className="text-slate-900">{equipments.length}</strong> of{" "}
              {totalCount} matched devices (project total {summary.total})
            </p>

            <div className="flex gap-3 text-xl font-semibold">
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

          <details className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg text-slate-700">
            <summary className="cursor-pointer select-none font-semibold text-slate-800">
              LSB rules help
            </summary>
            <div className="mt-3 flex flex-wrap gap-3 text-base">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                LSB Page 1 → Normal
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                LSB Page 2 → Emergency
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                Other pages keep original numbers
              </span>
            </div>
          </details>
        </div>
      </section>

      {/* DEVICE GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {equipments.map((device) => (
          <button
            key={device.id}
            className="text-left"
            onClick={() => {
              navigate(`/devices/${device.id}${location.search}`, {
                state: { device, fromSearch: location.search },
              });
            }}
          >
            <DeviceCard device={device} />
          </button>
        ))}

        {equipments.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-2xl p-16 text-center text-slate-500 bg-white text-2xl flex flex-col items-center gap-6">
            <p>No devices match current filters.</p>
            <button
              className="px-5 py-3 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold"
              onClick={() => {
                setSearchTerm("");
                setPageFilter("all");
                setEnergizedFilter("all");
                setSubjectFilter("all");
                setPage(1);
              }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default LSB_Dashboard_Page;
