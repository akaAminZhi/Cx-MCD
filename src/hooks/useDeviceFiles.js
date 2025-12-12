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
    staleTime: 5 * 60 * 1000, // 5 min
    cacheTime: 5 * 60 * 1000,
  });
}
