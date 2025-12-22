import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

let getAccessTokenFn = null;
let onUnauthorizedFn = null; // 401 回调（让外部决定怎么跳转/清缓存）

export function setGetAccessToken(fn) {
  getAccessTokenFn = fn;
}

export function setOnUnauthorized(fn) {
  onUnauthorizedFn = fn;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 1) 请求：自动带 token
api.interceptors.request.use(async (config) => {
  if (!getAccessTokenFn) return config;

  const token = await getAccessTokenFn();
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 用于避免 toast/跳转连发
let isHandling401 = false;

// 2) 响应：统一处理 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;

    if (status === 401 && !isHandling401) {
      isHandling401 = true;

      toast.error("Session expired. Please sign in again.");

      try {
        if (onUnauthorizedFn) {
          await onUnauthorizedFn();
        }
      } finally {
        // 给一点点时间避免并发请求重复触发
        setTimeout(() => {
          isHandling401 = false;
        }, 1000);
      }
    }

    return Promise.reject(err);
  }
);
