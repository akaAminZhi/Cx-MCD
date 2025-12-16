import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchDevice(deviceId) {
  const res = await axios.get(`/api/v1/devices/${deviceId}`);
  const payload = res.data;
  if (payload && typeof payload === "object" && "data" in payload) return payload.data;
  return payload;
}

export function useDevice(deviceId, { initialData } = {}) {
  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => fetchDevice(deviceId),
    enabled: !!deviceId,
    initialData,
  });
}

export default useDevice;
