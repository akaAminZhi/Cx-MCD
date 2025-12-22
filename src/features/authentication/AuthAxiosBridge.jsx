import React from "react";
import { useAuth } from "./useAuth";
import { setGetAccessToken } from "./axiosClient";

export default function AuthAxiosBridge() {
  const { getAccessToken, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      setGetAccessToken(getAccessToken);
    } else {
      setGetAccessToken(null);
    }
  }, [isAuthenticated, getAccessToken]);

  return null;
}
