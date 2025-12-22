import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const authority = import.meta.env.VITE_AZURE_AUTHORITY;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI;

export const msalConfig = {
  auth: {
    clientId,
    authority,
    redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        // 打开下面这行可以调试 MSAL（生产建议关）
        // console.log(message);
      },
      logLevel: LogLevel.Info,
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", import.meta.env.VITE_AZURE_API_SCOPE].filter(
    Boolean
  ),
};

export const tokenRequest = {
  scopes: [import.meta.env.VITE_AZURE_API_SCOPE].filter(Boolean),
};

export const msalInstance = new PublicClientApplication(msalConfig);
