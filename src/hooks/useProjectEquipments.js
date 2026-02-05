// api/useProjectEquipments.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 真正请求数据的函数
async function fetchProjectEquipments({ queryKey }) {
  const [_key, projectId, params] = queryKey;

  const res = await axios.get(`/api/v1/projects/${projectId}/equipments`, {
    // 如果有 page/size 就带上，没有就让后端返回全部
    params:
      params && params.page && params.size
        ? {
            page: params.page,
            size: params.size,
          }
        : undefined,
  });

  return res.data; // { project, data: [...], pagination? }
}

/**
 * @param {string} projectId - 项目 ID，比如 "lsb"
 * @param {{ page?: number, size?: number, enabled?: boolean }} options
 */
import { keepPreviousData } from "@tanstack/react-query";

export function useProjectEquipments(projectId, options = {}) {
  const { page, size, enabled = true } = options;

  const hasPagination =
    Number.isInteger(page) && page > 0 && Number.isInteger(size) && size > 0;

  return useQuery({
    queryKey: [
      "projectEquipments",
      projectId,
      hasPagination ? { page, size } : null,
    ],
    queryFn: fetchProjectEquipments,
    enabled: !!projectId && enabled,

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    placeholderData: hasPagination ? keepPreviousData : undefined, // ✅ v5
  });
}
