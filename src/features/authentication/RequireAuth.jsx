import React from "react";
import { Navigate, useLocation } from "react-router";
import { useIsAuthenticated } from "@azure/msal-react";

export default function RequireAuth({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
