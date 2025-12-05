import { Link, useLocation } from "react-router";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { getCurrentPath } from "../utils/analysePath";
import Button from "./Button";
import Logout from "../features/authentication/Logout";

function Header() {
  const location = useLocation();
  // 获取当前 pathname，例如 '/about' 或 '/projects/1'

  const { pathname } = location;
  // 分割路径，过滤掉空字符串
  // const pathSegments = pathname.split("/").filter(Boolean);
  const pathSegments = getCurrentPath(pathname);
  // 累加路径用于生成点击跳转的路径
  let accumulatedPath = "";
  return (
    <header className="p-[1.2rem_4.8rem] border-b-2 border-b-gray-100 flex justify-between">
      <nav className="flex items-center gap-2">
        {pathSegments.map((segment, index) => {
          // 累加路径，例如 '/projects' 或 '/projects/1'
          accumulatedPath += `/${segment}`;
          // 格式化显示（首字母大写）
          const displayName =
            segment.charAt(0).toUpperCase() + segment.slice(1);
          return (
            <span key={index} className="flex items-center gap-2 text-3xl ">
              {index + 1 !== pathSegments.length ? (
                <>
                  <Link
                    to={accumulatedPath}
                    className="text-indigo-600 hover:underline"
                  >
                    {displayName}
                  </Link>
                  <HiOutlinePaperAirplane className="w-10 h-10" />
                </>
              ) : (
                displayName
              )}
            </span>
          );
        })}
      </nav>
      <Logout></Logout>
    </header>
  );
}

export default Header;
