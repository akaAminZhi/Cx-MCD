import "./App.css";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Homepage from "./pages/Homepage";
import LSB_Diagrams from "./pages/LSB_Diagrams";

import AppLayout from "./ui/AppLayout";
import PageNotFound from "./pages/PageNotFound";




const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <AppLayout />, // 包含 <Outlet/>
    children: [
      { path: "home", element: <Homepage /> },
      { path: "lsbdiagrams", element: <LSB_Diagrams /> },


      // 其他受保护页面...
    ],
  },


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
  );
}

export default App;
