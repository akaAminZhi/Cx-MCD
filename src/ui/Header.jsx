import { NavLink } from "react-router";
import { HiArrowUpRight } from "react-icons/hi2";
import Logout from "../features/authentication/Logout";
import Logo from "./Logo";

function Header({ className = "" }) {
  const navGroups = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard Home",
          to: "/dashboard",
          desc: "All project metrics and latest device state",
        },
        {
          label: "Energized Devices",
          to: "/dashboard?energized=on",
          desc: "Quickly focus on currently energized equipment",
        },
      ],
    },
    {
      title: "Power Systems",
      items: [
        {
          label: "LSB Diagrams",
          to: "/lsbdiagrams",
          desc: "Open one-line and power-flow visual diagrams",
        },
        {
          label: "Scheduled Work",
          to: "/dashboard?pageFilter=emergency",
          desc: "Review emergency-side planned energization scope",
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
          <Logo />

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
                        {group.items.map((item) => (
                          <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                              `rounded-2xl px-4 py-3 flex items-start justify-between gap-4 transition-all ${
                                isActive
                                  ? "bg-slate-900 text-white"
                                  : "hover:bg-slate-100 text-slate-700"
                              }`
                            }
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
                          </NavLink>
                        ))}
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
