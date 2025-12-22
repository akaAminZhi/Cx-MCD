import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest, tokenRequest } from "./msalConfig";

export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const account = accounts?.[0] ?? null;

  const login = async () => {
    // 你也可以改为 loginRedirect
    await instance.loginPopup(loginRequest);
  };

  const logout = async () => {
    await instance.logoutPopup({
      mainWindowRedirectUri: "/login",
    });
  };

  const getAccessToken = async () => {
    if (!account) throw new Error("No signed-in account");

    const request = {
      ...tokenRequest,
      account,
    };

    try {
      const res = await instance.acquireTokenSilent(request);
      return res.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        const res = await instance.acquireTokenPopup(request);
        return res.accessToken;
      }
      // 其它错误：也尝试交互式
      const res = await instance.acquireTokenPopup(request);
      return res.accessToken;
    }
  };

  const user = {
    username: account?.username ?? "",
    name: account?.name ?? "",
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    getAccessToken,
  };
}
