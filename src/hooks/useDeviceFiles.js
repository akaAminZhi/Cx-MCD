// api/useDeviceFiles.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchDeviceFiles(deviceId) {
  const res = await axios.get(`/api/v1/devices/${deviceId}/files`);
  return res.data; // { device_id, count, data: [...] }
}

export function useDeviceFiles(deviceId) {
  return useQuery({
    queryKey: ["deviceFiles", deviceId],
    queryFn: () => fetchDeviceFiles(deviceId),
    enabled: !!deviceId,

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // ✅ v5：gcTime（建议给更长，避免频繁回收）

    refetchOnMount: false, // ✅ 卡片卸载/挂载时别自动 refetch
    refetchOnWindowFocus: false, // ✅ 切回窗口别抖
    refetchOnReconnect: false,
  });
}
