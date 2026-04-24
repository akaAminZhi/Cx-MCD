import { useState } from "react";
import { Outlet } from "react-router";
import {
  HiBars3BottomLeft,
  HiChevronRight,
  HiChevronLeft,
  HiRectangleGroup,
} from "react-icons/hi2";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showFloatingRail, setShowFloatingRail] = useState(false);

  return (
    <div className="h-screen max-w-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-hidden">
      <div
        className={`
          fixed z-50 left-0 top-1/2 -translate-y-1/2
          transition-transform duration-300 ease-out
          ${showFloatingRail ? "translate-x-0" : "-translate-x-[72%]"}
        `}
      >
        <div className="backdrop-blur-2xl bg-white/55 border border-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.18)] rounded-r-[2.4rem] pl-6 pr-4 py-5 flex items-center gap-3">
          <button
            onClick={() => setShowFloatingRail((v) => !v)}
            className="w-12 h-12 rounded-full border border-slate-200 bg-white/90 text-slate-700 hover:bg-white transition-all inline-flex items-center justify-center"
            title={showFloatingRail ? "Hide controls" : "Show controls"}
          >
            {showFloatingRail ? (
              <HiChevronLeft className="w-6 h-6" />
            ) : (
              <HiChevronRight className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => setShowSidebar((v) => !v)}
            className={`w-12 h-12 rounded-full transition-all border inline-flex items-center justify-center ${
              showSidebar
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            <HiBars3BottomLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowHeader((v) => !v)}
            className={`w-12 h-12 rounded-full transition-all border inline-flex items-center justify-center ${
              showHeader
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title={showHeader ? "Hide header" : "Show header"}
          >
            <HiRectangleGroup className="w-6 h-6" />
          </button>
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
