import { useState } from "react";
import { Outlet } from "react-router";
import { HiBars3BottomLeft, HiRectangleGroup } from "react-icons/hi2";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  return (
    <div className="h-screen max-w-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-hidden">
      <div className="fixed z-50 left-8 top-6">
        <div className="backdrop-blur-xl bg-white/70 border border-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.12)] rounded-2xl px-3 py-2 flex items-center gap-2">
          <button
            onClick={() => setShowSidebar((v) => !v)}
            className={`px-3 py-2 rounded-xl transition-all border ${
              showSidebar
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <HiBars3BottomLeft className="w-5 h-5" />
              Sidebar
            </span>
          </button>

          <button
            onClick={() => setShowHeader((v) => !v)}
            className={`px-3 py-2 rounded-xl transition-all border ${
              showHeader
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title={showHeader ? "Hide header" : "Show header"}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <HiRectangleGroup className="w-5 h-5" />
              Header
            </span>
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
