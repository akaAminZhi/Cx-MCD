import { useRef, useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  HiBolt,
  HiHomeModern,
  HiMap,
  HiRectangleGroup,
} from "react-icons/hi2";
import Header from "./Header";

function AppLayout() {
  const [showHeader, setShowHeader] = useState(false);
  const [showOrbMenu, setShowOrbMenu] = useState(false);
  const closeTimerRef = useRef(null);

  function openOrbMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShowOrbMenu(true);
  }

  function closeOrbMenuWithDelay() {
    closeTimerRef.current = setTimeout(() => {
      setShowOrbMenu(false);
    }, 180);
  }

  return (
    <div className="h-screen max-w-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-hidden">
      <div
        className="fixed z-50 left-[-3.5rem] top-1/2 -translate-y-1/2 w-[24rem] h-[19rem]"
        onMouseEnter={openOrbMenu}
        onMouseLeave={closeOrbMenuWithDelay}
      >
        <div className="relative w-full h-full">
          <div
            className={`absolute left-0 top-[6rem] w-28 h-28 rounded-full shadow-[0_18px_50px_rgba(15,23,42,0.24)] border border-white/80 bg-[radial-gradient(circle_at_30%_30%,#fef08a_0%,#86efac_35%,#60a5fa_70%,#a78bfa_100%)] ring-4 ring-white/60 backdrop-blur-md transition-transform duration-300 ${
              showOrbMenu ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute left-0 top-[6rem] w-28 h-28 flex items-center justify-center text-white drop-shadow">
            <HiBolt className="w-10 h-10" />
          </div>

          <NavLink
            to="/dashboard"
            title="Home"
            className={({ isActive }) =>
              `absolute left-[10.3rem] top-[2.2rem] w-14 h-14 rounded-full border border-white/80 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.2)] inline-flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              } ${showOrbMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`
            }
          >
            <HiHomeModern className="w-7 h-7" />
          </NavLink>

          <NavLink
            to="/lsbdiagrams"
            title="LSB Diagrams"
            className={({ isActive }) =>
              `absolute left-[12.2rem] top-[7.5rem] w-14 h-14 rounded-full border border-white/80 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.2)] inline-flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white/70 text-slate-700 hover:bg-white"
              } ${showOrbMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`
            }
          >
            <HiMap className="w-7 h-7" />
          </NavLink>

          <button
            title={showHeader ? "Hide header" : "Show header"}
            onClick={() => setShowHeader((v) => !v)}
            className={`absolute left-[10.3rem] top-[12.8rem] w-14 h-14 rounded-full border border-white/80 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.2)] inline-flex items-center justify-center transition-all duration-300 ${
              showHeader
                ? "bg-slate-900 text-white"
                : "bg-white/70 text-slate-700 hover:bg-white"
            } ${showOrbMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`}
          >
            <HiRectangleGroup className="w-7 h-7" />
          </button>
        </div>
      </div>

      <div className="h-full w-full flex">
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
