import { Link, useLocation } from "react-router";
import { HiArrowUpRight, HiXMark } from "react-icons/hi2";
import Logout from "../features/authentication/Logout";
import Logo from "./Logo";

function Header({ className = "" }) {
  const location = useLocation();

  const normalizeQuery = (search) => {
    const params = new URLSearchParams(search);
    return [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
  };

  const isItemActive = (item) => {
    if (item.disabled) return false;

    const [targetPath, targetQuery = ""] = item.to.split("?");
    if (location.pathname !== targetPath) return false;

    const currentQuery = normalizeQuery(location.search.replace(/^\?/, ""));
    const expectedQuery = normalizeQuery(targetQuery);

    return currentQuery === expectedQuery;
  };

  const navGroups = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          to: "/dashboard",
          desc: "All project metrics and latest device state",
        },
        {
          label: "LSB Diagrams",
          to: "/lsbdiagrams",
          desc: "Open one-line and power-flow visual diagrams",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          label: "Energized Devices",
          to: "/dashboard?energized=on",
          desc: "Quickly focus on currently energized equipment",
        },
        {
          label: "Emergency Scope",
          to: "/dashboard?pageFilter=emergency",
          desc: "Review emergency-side planned energization scope",
        },
      ],
    },
    {
      title: "Planning",
      items: [
        {
          label: "Scheduled Active",
          to: "/dashboard?energized=off",
          desc: "Review planned activations and pending devices",
          disabled: true,
        },
        {
          label: "Normal Scope",
          to: "/dashboard?pageFilter=normal",
          desc: "Focus on normal-side planning and execution",
          disabled: true,
        },
      ],
    },
    {
      title: "Insights",
      items: [
        {
          label: "All Subjects",
          to: "/dashboard?subject=all",
          desc: "Compare all equipment subjects in one view",
          disabled: true,
        },
        {
          label: "Recent Updates",
          to: "/dashboard?q=",
          desc: "Use this as a template for future analytics links",
          disabled: true,
        },
      ],
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl ${className}`}
    >
      <div className="px-12 py-5 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="rounded-xl hover:bg-white/80 transition-colors px-2 py-1"
            title="Back to Dashboard"
          >
            <Logo />
          </Link>

          <nav>
            <ul className="flex items-center gap-2">
              {navGroups.map((group) => (
                <li key={group.title} className="relative group">
                  <button className="px-4 py-2 text-lg font-semibold text-slate-700 hover:text-slate-950 transition-colors rounded-xl hover:bg-white/80">
                    {group.title}
                  </button>

                  <div className="absolute left-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                    <div className="w-[30rem] rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-4">
                      <p className="px-3 pb-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {group.title}
                      </p>

                      <div className="flex flex-col gap-2">
                        {group.items.map((item) => {
                          const isActive = isItemActive(item);
                          if (item.disabled) {
                            return (
                              <button
                                key={item.label}
                                type="button"
                                disabled
                                className="w-full rounded-2xl px-4 py-3 flex items-start justify-between gap-4 transition-all bg-slate-100/70 text-slate-500 opacity-55 cursor-not-allowed hover:opacity-80 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <span className="text-left">
                                  <span className="block text-lg font-semibold">
                                    {item.label}
                                  </span>
                                  <span className="block text-sm opacity-80 mt-1">
                                    {item.desc}
                                  </span>
                                </span>
                                <span className="w-7 h-7 rounded-full border border-rose-300 inline-flex items-center justify-center mt-1">
                                  <HiXMark className="w-5 h-5 text-rose-500" />
                                </span>
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={item.label}
                              to={item.to}
                              className={`rounded-2xl px-4 py-3 flex items-start justify-between gap-4 transition-all ${
                                isActive
                                  ? "bg-slate-900 text-white"
                                  : "hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <span>
                                <span className="block text-lg font-semibold">
                                  {item.label}
                                </span>
                                <span className="block text-sm opacity-80 mt-1">
                                  {item.desc}
                                </span>
                              </span>
                              <HiArrowUpRight className="w-5 h-5 mt-1 shrink-0 opacity-70" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Logout />
      </div>
    </header>
  );
}

export default Header;
