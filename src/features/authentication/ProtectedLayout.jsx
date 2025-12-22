import React from "react";
import { Outlet } from "react-router";
import RequireAuth from "./RequireAuth";

export default function ProtectedLayout() {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
}
