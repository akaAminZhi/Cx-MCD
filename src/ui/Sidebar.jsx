import Logo from "./Logo";
import MainNav from "./MainNav";

function Sidebar() {
  return (
    <aside className="flex flex-col gap-3 p-12 row-span-full border-r-2 border-r-gray-100">
      <Logo></Logo>
      <MainNav></MainNav>
      
    </aside>
  );
}

export default Sidebar;
