import { useEffect, useMemo, useState } from "react";
import { PiPlugsConnectedBold } from "react-icons/pi";
import {
  HiBolt,
  HiCalendarDays,
  HiExclamationTriangle,
  HiFire,
  HiMagnifyingGlass,
  HiMiniArrowTrendingUp,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiBoltSlash,
} from "react-icons/hi2";
import { format, formatDistanceToNow, isAfter, subHours } from "date-fns";
import Heading from "../ui/Heading";
import { useProjectEquipments } from "../hooks/useProjectEquipments";
import Spinner from "../ui/Spinner";
import { useDeviceFiles } from "../hooks/useDeviceFiles";

function getFilePageMeta(device) {
  if (device.project === "lsb") {
    if (device.file_page === 1)
      return {
        label: "Normal",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <PiPlugsConnectedBold className="w-5 h-5" />,
      };
    if (device.file_page === 2)
      return {
        label: "Emergency",
        tone: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <HiFire className="w-5 h-5" />,
      };
  }
  return {
    label: `Page ${device.file_page}`,
    tone: "bg-slate-50 text-slate-700 border-slate-200",
    icon: <HiOutlineDocumentText className="w-5 h-5" />,
  };
}

function SummaryCard({ title, value, icon, tone }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm bg-white flex items-center gap-4 ${tone}`}
    >
      <div className="rounded-xl bg-white/80 p-3 shadow-inner text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-2xl uppercase tracking-wide">
          {title}
        </p>
        <p className="text-3xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ device }) {
  const meta = getFilePageMeta(device);
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm border px-3 py-1 rounded-full ${meta.tone}`}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

function DeviceCard({ device }) {
  const meta = getFilePageMeta(device);
  const updatedAgo = formatDistanceToNow(new Date(device.updated_at), {
    addSuffix: true,
  });
  const scheduled = device.will_energized_at
    ? format(new Date(device.will_energized_at), "MMM d, HH:mm")
    : null;

  // ✅ 懒加载 file 数量，完全独立于 dashboard 的设备列表
  const {
    data: filesData,
    isLoading: isFilesLoading,
    error: filesError,
  } = useDeviceFiles(device.id);

  const fileCount = filesError ? "?" : (filesData?.count ?? 0);

  return (
    <article
      className="
        group relative
        border rounded-2xl bg-white p-5 shadow-sm flex flex-col gap-4
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 hover:bg-indigo-50/40
        focus-within:-translate-y-1 focus-within:shadow-lg focus-within:border-indigo-400
        cursor-pointer
      "
    >
      {/* 左侧高亮条，用来强调“选中感” */}
      <span
        className="
          pointer-events-none
          absolute inset-y-4 left-0 w-1 rounded-r-2xl
          bg-indigo-400/80
          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
          transition-opacity duration-200
        "
      />

      {/* 下面保持你原来的内容结构不变 */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-400">{device.project}</p>
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            {device.text}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {device.subject}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge device={device} />
          <span
            className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full border ${
              device.energized
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <HiBolt className="w-4 h-4" />
            {device.energized ? "Energized" : "Not energized"}
          </span>
          {device.energized_today && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1 flex items-center gap-1">
              <HiMiniArrowTrendingUp className="w-4 h-4" /> Today active
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <HiOutlineMapPin className="w-5 h-5 text-indigo-500" />
          <span className="font-medium text-slate-700">{device.id}</span>
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
          <span className="truncate">From: {device.from}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="truncate">To: {device.to}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          Updated {updatedAgo}
        </span>

        <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
          Files: {isFilesLoading ? "…" : fileCount}
        </span>

        {scheduled && (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
            <HiCalendarDays className="w-4 h-4" /> {scheduled}
          </span>
        )}
        {device.comments && (
          <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
            {device.comments}
          </span>
        )}
      </div>
    </article>
  );
}

function Dashboard() {
  // 1️⃣ 所有 hooks 都放在最上面，顺序始终不变
  const [pageFilter, setPageFilter] = useState("all");
  const [energizedFilter, setEnergizedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const { data, isLoading, error } = useProjectEquipments("lsb");
  const Equipement = data?.data ?? [];

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
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [page, totalPages]);

  const pagedDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAll.slice(start, end);
  }, [filteredAll, page, pageSize]);

  const summary = useMemo(() => {
    const total = Equipement.length;
    const energized = Equipement.filter((d) => d.energized).length;
    const today = Equipement.filter((d) => d.energized_today).length;
    const normal = Equipement.filter(
      (d) => d.project === "lsb" && d.file_page === 1
    ).length;
    const emergency = Equipement.filter(
      (d) => d.project === "lsb" && d.file_page === 2
    ).length;
    const upcoming = Equipement.filter(
      (d) =>
        d.will_energized_at &&
        isAfter(new Date(d.will_energized_at), subHours(new Date(), 1))
    ).length;
    return { total, energized, today, normal, emergency, upcoming };
  }, [Equipement]);

  // 2️⃣ 所有 hooks 都已经声明完了，下面才允许 return（条件分支）

  const isInitialLoading = isLoading && !data;
  if (isInitialLoading) return <Spinner />;

  if (error)
    return (
      <div className="p-10 text-center text-rose-500">
        Failed to load devices: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Heading Tag="h1" className="text-slate-900">
          Device Dashboard
        </Heading>
      </header>

      {/* Summary：全项目数据 */}
      <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          title="Total Devices"
          value={summary.total}
          icon={<HiOutlineDocumentText className="w-6 h-6" />}
          tone="border-slate-200"
        />
        <SummaryCard
          title="Energized"
          value={summary.energized}
          icon={<HiBolt className="w-6 h-6" />}
          tone="border-emerald-200 bg-emerald-50/60"
        />
        <SummaryCard
          title="Today Active"
          value={summary.today}
          icon={<HiMiniArrowTrendingUp className="w-6 h-6" />}
          tone="border-indigo-200 bg-indigo-50/60"
        />
        <SummaryCard
          title="Normal (LSB)"
          value={summary.normal}
          icon={<PiPlugsConnectedBold className="w-6 h-6" />}
          tone="border-emerald-100 bg-emerald-50/40"
        />
        <SummaryCard
          title="Emergency (LSB)"
          value={summary.emergency}
          icon={<HiFire className="w-6 h-6" />}
          tone="border-rose-100 bg-rose-50/40"
        />
        <SummaryCard
          title="Scheduled"
          value={summary.upcoming}
          icon={<HiCalendarDays className="w-6 h-6" />}
          tone="border-amber-100 bg-amber-50/50"
        />
      </section>

      {/* 搜索 + 筛选 + 分页信息 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="relative">
              <HiMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // 搜索变化时回到第一页
                }}
                placeholder="Search by ID / subject / text (client-side)"
                className="pl-10 pr-4 py-2 border rounded-xl text-sm w-72 focus:outline focus:outline-2 focus:outline-indigo-500"
              />
            </label>

            <select
              value={pageFilter}
              onChange={(e) => {
                setPageFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded-xl px-3 py-2 text-sm focus:outline focus:outline-2 focus:outline-indigo-500"
            >
              <option value="all">All pages</option>
              <option value="normal">Normal (LSB)</option>
              <option value="emergency">Emergency (LSB)</option>
            </select>
            <select
              value={energizedFilter}
              onChange={(e) => {
                setEnergizedFilter(e.target.value);
                setPage(1);
              }}
              className="border rounded-xl px-3 py-2 text-sm focus:outline focus:outline-2 focus:outline-indigo-500"
            >
              <option value="all">All energy states</option>
              <option value="on">Energized</option>
              <option value="off">Not energized</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
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
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing{" "}
            <strong className="text-slate-700">{pagedDevices.length}</strong> of{" "}
            {totalCount} matched devices (total in project {summary.total})
          </p>
          <p className="flex items-center gap-1 text-amber-600">
            <HiExclamationTriangle className="w-4 h-4" /> Use filters to focus
            on a specific path.
          </p>
        </div>

        {/* 分页控制（完全前端） */}
        <div className="flex justify-end gap-2 mt-2 text-sm">
          <button
            className="px-3 py-1 rounded-xl border border-slate-200 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="px-2 py-1 text-slate-600">
            Page {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded-xl border border-slate-200 disabled:opacity-40"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </section>

      {/* 卡片列表：用分页后的 pagedDevices */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pagedDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
        {pagedDevices.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500 bg-white">
            No devices match current filters.
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
