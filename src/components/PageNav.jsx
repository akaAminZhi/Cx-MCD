import { Link } from "react-router";

const pathObejcts = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/Projects",
    name: "Projects",
  },
  {
    path: "/Login",
    name: "Login",
  },
];
function PageNav() {
  return (
    <nav>
      <ul className=" flex gap-2 bg-gray-200 justify-between">
        {pathObejcts.map((path, index) => {
          return (
            <li key={index}>
              <Link className="active:bg-blue-700" to={path.path}>
                {path.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default PageNav;
