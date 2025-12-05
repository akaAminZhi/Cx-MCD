import { useQuery } from "@tanstack/react-query";
import { getProjectDeviceStats } from "../../services/apiDevices";

export function useProjectDeviceStats() {
  const { data: projectDeviceStats, isPending } = useQuery({
    queryKey: ["ProjectDeviceStats"],
    queryFn: getProjectDeviceStats,
  });
  return { projectDeviceStats, isPending };
}
