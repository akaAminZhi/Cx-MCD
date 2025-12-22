import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { useAuth } from "../features/authentication/useAuth";
import {
  setGetAccessToken,
  setOnUnauthorized,
} from "../features/authentication/axiosClient";

function AppLayout() {
  const { getAccessToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // 1) 注入 getAccessToken 给 axios（登录/退出时更新）
  React.useEffect(() => {
    setGetAccessToken(isAuthenticated ? getAccessToken : null);
  }, [isAuthenticated, getAccessToken]);

  // 2) 注册 401 处理（只需要注册一次，但要能拿到“当前路径”）
  // 用 ref 存最新路径，避免把 location 放到依赖里导致重复注册
  const latestPathRef = React.useRef({
    pathname: location.pathname,
    search: location.search,
  });
  React.useEffect(() => {
    latestPathRef.current = {
      pathname: location.pathname,
      search: location.search,
    };
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    setOnUnauthorized(async () => {
      const { pathname, search } = latestPathRef.current;
      const from = pathname + search;

      // 如果已经在 login，就不重复跳
      if (pathname === "/login") return;

      // 清掉缓存，避免显示旧数据
      queryClient.clear();

      navigate("/login", { replace: true, state: { from } });
    });
  }, [navigate, queryClient]);

  return (
    <div className="grid grid-cols-[20rem_1fr] grid-rows-[auto_1fr] h-screen max-w-screen">
      <Header />
      <Sidebar />
      <main className="bg-gray-50 p-10 relative whitespace-normal break-all">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
