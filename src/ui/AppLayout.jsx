import { Outlet } from "react-router";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="h-screen max-w-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 overflow-hidden">
      <div className="h-full w-full flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-10 relative whitespace-normal break-all">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
