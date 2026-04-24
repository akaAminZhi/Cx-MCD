import Logo from "./Logo";
import MainNav from "./MainNav";

function Sidebar({ className = "" }) {
  return (
    <aside
      className={`flex flex-col gap-3 p-12 border-r-2 border-r-gray-100 ${className}`}
    >
      <Logo></Logo>
      <MainNav></MainNav>
    </aside>
  );
}

export default Sidebar;
