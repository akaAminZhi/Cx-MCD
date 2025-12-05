import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDevices = async (projectId) => {
  const res = await axios.get(`/api/v1/projects/${projectId}/devices`);
  return res.data;
};

export default function useProjecDevices(projectId) {
  return useQuery({
    queryKey: ["devices", projectId],
    queryFn: () => fetchDevices(projectId),
    // ✅ 缓存时间设置
    staleTime: 60 * 5 * 1000, // 数据在 1 小时内都视为“新鲜”，不会自动重新请求
    cacheTime: 60 * 5 * 1000, // 数据在内存中缓存 1 小时（默认也是 5 分钟）
    enabled: !!projectId, // projectId 有值时才请求
  });
}
