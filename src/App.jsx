import "./App.css";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import LSB_Diagrams from "./pages/LSB_Diagrams";
import DeviceDetail from "./pages/DeviceDetail";
import Login from "./pages/Login";
import AppLayout from "./ui/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import AuthProvider from "./features/authentication/AuthProvider";
import RequireAuth from "./features/authentication/RequireAuth";

import ProtectedLayout from "./features/authentication/ProtectedLayout";
import AuthAxiosBridge from "./features/authentication/AuthAxiosBridge";

// const router = createBrowserRouter([
//   // ✅ login 独立（不走 AppLayout，不显示 header/sidebar）
//   { path: "/login", element: <Login /> },

//   // ✅ 业务区域：先 AppLayout，再 ProtectedLayout，再各个页面
//   {
//     path: "/",
//     element: <AppLayout />,
//     children: [
//       { index: true, loader: () => redirect("/dashboard") },

//       {
//         // 这一层统一做登录保护
//         element: <ProtectedLayout />,
//         children: [
//           { path: "dashboard", element: <Dashboard /> },
//           { path: "home", loader: () => redirect("/dashboard") },
//           { path: "lsbdiagrams", element: <LSB_Diagrams /> },
//           { path: "devices/:deviceId", element: <DeviceDetail /> },
//           // ...以后再加几十个也不用重复包 RequireAuth
//         ],
//       },
//     ],
//   },

//   { path: "*", element: <PageNotFound /> },
// ]);

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <AppLayout />, // 包含 <Outlet/>
    children: [
      { index: true, loader: () => redirect("/dashboard") },
      {
        path: "dashboard",
        element: (
          // <RequireAuth>
          <Dashboard />
          // </RequireAuth>
        ),
      },
      { path: "home", loader: () => redirect("/dashboard") },
      { path: "lsbdiagrams", element: <LSB_Diagrams /> },
      { path: "devices/:deviceId", element: <DeviceDetail /> },

      // 其他受保护页面...
    ],
  },
  { path: "login", element: <Login /> },
  { path: "*", element: <PageNotFound /> },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});
function App() {
  return (
    <AuthProvider>
      <AuthAxiosBridge />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
            },
          }}
        />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
