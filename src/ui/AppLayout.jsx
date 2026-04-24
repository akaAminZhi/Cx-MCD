import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  HiBars3BottomLeft,
  HiHomeModern,
  HiMap,
  HiRectangleGroup,
} from "react-icons/hi2";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  return (
    <div className="h-screen max-w-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-hidden">
      <div className="fixed z-50 left-4 top-1/2 -translate-y-1/2 group">
        <div className="relative">
          <div className="w-20 h-20 rounded-full shadow-[0_18px_50px_rgba(15,23,42,0.24)] border border-white/80 bg-[radial-gradient(circle_at_30%_30%,#fef08a_0%,#86efac_35%,#60a5fa_70%,#a78bfa_100%)] ring-4 ring-white/60 backdrop-blur-md transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
            <HiBars3BottomLeft className="w-8 h-8" />
          </div>

          <div className="pointer-events-none absolute left-24 top-1/2 -translate-y-1/2 w-0 opacity-0 group-hover:w-[20rem] group-hover:opacity-100 transition-all duration-300">
            <div className="pointer-events-auto rounded-[2rem] border border-white/80 bg-white/70 backdrop-blur-2xl shadow-[0_24px_60px_rgba(15,23,42,0.2)] p-5 flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Quick Navigation
              </p>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-xl font-semibold transition-all inline-flex items-center gap-3 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white/80 text-slate-700 hover:bg-white"
                  }`
                }
              >
                <HiHomeModern className="w-6 h-6" />
                Home
              </NavLink>

              <NavLink
                to="/lsbdiagrams"
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-xl font-semibold transition-all inline-flex items-center gap-3 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white/80 text-slate-700 hover:bg-white"
                  }`
                }
              >
                <HiMap className="w-6 h-6" />
                LSB Diagrams
              </NavLink>

              <div className="mt-1 pt-3 border-t border-white/80 flex gap-2">
                <button
                  onClick={() => setShowSidebar((v) => !v)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all ${
                    showSidebar
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white/90 text-slate-700 border-slate-200 hover:bg-white"
                  }`}
                >
                  Sidebar
                </button>
                <button
                  onClick={() => setShowHeader((v) => !v)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all inline-flex items-center gap-2 ${
                    showHeader
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white/90 text-slate-700 border-slate-200 hover:bg-white"
                  }`}
                >
                  <HiRectangleGroup className="w-4 h-4" />
                  Header
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full w-full flex">
        <Sidebar
          className={`transition-all duration-300 ease-out overflow-hidden ${
            showSidebar
              ? "w-[20rem] opacity-100"
              : "w-0 opacity-0 p-0 border-r-0 pointer-events-none"
          }`}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            className={`transition-all duration-300 ease-out overflow-hidden ${
              showHeader
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0 p-0 border-b-0 pointer-events-none"
            }`}
          />
          <main className="flex-1 overflow-auto p-10 relative whitespace-normal break-all">
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
