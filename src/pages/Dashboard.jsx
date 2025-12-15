import { useMemo, useState } from "react";
import {
  HiBolt,
  HiCalendarDays,
  HiCheckCircle,
  HiExclamationTriangle,
  HiFire,
  HiMagnifyingGlass,
  HiMiniArrowTrendingUp,
  HiOutlineDocumentText,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { format, formatDistanceToNow, isAfter, subHours } from "date-fns";
import Heading from "../ui/Heading";
import useProjecDevices from "../hooks/useProjectDevices";

function getFilePageMeta(device) {
  if (device.project === "lsb") {
    if (device.file_page === 1)
      return {
        label: "Normal",
        tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <HiCheckCircle className="w-5 h-5" />,
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

  return (
    <article className="border rounded-2xl bg-white p-5 shadow-sm flex flex-col gap-4">
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
          Files: {device.files?.length || 0}
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
  const [pageFilter, setPageFilter] = useState("all");
  const [energizedFilter, setEnergizedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useProjecDevices("lsb");
  // data 还没来时，Equipement 就是空数组，避免 undefined 报错
  const Equipement = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((device) => {
      if (
        device.subject === "panel board" ||
        device.subject === "transformer" ||
        device.subject === "Generator"
      ) {
        return true;
      }
    });
  }, [data]);
  const filteredDevices = useMemo(() => {
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
  }, [pageFilter, energizedFilter, searchTerm]);

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
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Heading Tag="h1" className="text-slate-900">
          Device Dashboard
        </Heading>
        {/* <p className="text-slate-600 max-w-3xl">
          实时洞察设备状态：默认 Home 跳转到此 Dashboard，可快速浏览 Normal 与 Emergency
          回路、能量激活、以及即将投运的设备。
        </p> */}
      </header>

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
          icon={<HiCheckCircle className="w-6 h-6" />}
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="relative">
              <HiMagnifyingGlass className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID / subject / text"
                className="pl-10 pr-4 py-2 border rounded-xl text-sm w-72 focus:outline focus:outline-2 focus:outline-indigo-500"
              />
            </label>

            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm focus:outline focus:outline-2 focus:outline-indigo-500"
            >
              <option value="all">All pages</option>
              <option value="normal">Normal (LSB)</option>
              <option value="emergency">Emergency (LSB)</option>
            </select>
            <select
              value={energizedFilter}
              onChange={(e) => setEnergizedFilter(e.target.value)}
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
            <strong className="text-slate-700">{filteredDevices.length}</strong>{" "}
            of {Equipement.length} devices
          </p>
          <p className="flex items-center gap-1 text-amber-600">
            <HiExclamationTriangle className="w-4 h-4" /> Use filters to focus
            on a specific path.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
        {filteredDevices.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500 bg-white">
            No devices match current filters.
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
