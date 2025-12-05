import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";


function AppLayout() {

  return (
    

      <div className="grid grid-cols-[20rem_1fr] grid-rows-[auto_1fr] h-screen max-w-screen">
        <Header></Header>
        <Sidebar></Sidebar>
        <main className="bg-gray-50 p-10 relative  whitespace-normal break-all">
          <Outlet></Outlet>
        </main>
      </div>
    
  );
}

export default AppLayout;
