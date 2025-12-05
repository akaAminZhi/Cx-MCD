import {
  HiMiniRectangleStack,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineMap,
} from "react-icons/hi2";
import { NavLink } from "react-router";

function MainNav() {
  const navIterm = [
    {
      toPath: "/dashboard",
      iconName: HiOutlineHome,
      name: "Home",
    },
    {
      toPath: "/lsbdiagrams",
      iconName: HiOutlineMap,
      name: "LSB Diagrams",
    },
  ];
  const natLinkStyle =
    "visited:text-stone-800  rounded-xl hover:bg-stone-200 hover:rounded-xl flex items-center gap-4 text-stone-600 text-2xl  px-6  py-2 transition-all";
  const svgStyle = "w-10 h-10  transition-all duration-300";
  return (
    <nav>
      <ul className="flex gap-10 flex-col">
        {navIterm.map((iterm) => {
          return (
            <li key={iterm.name}>
              <NavLink
                to={iterm.toPath}
                className={({ isActive }) =>
                  isActive
                    ? natLinkStyle + " bg-stone-200 font-semibold"
                    : natLinkStyle
                }
              >
                {({ isActive }) => (
                  <>
                    <iterm.iconName
                      className={
                        isActive
                          ? svgStyle + " text-indigo-600 font-semibold"
                          : svgStyle
                      }
                    />
                    <span className="">{iterm.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainNav;
