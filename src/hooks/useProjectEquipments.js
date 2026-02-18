// api/useProjectEquipments.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";

/**
 * queryKey: ["projectEquipments", projectId, params]
 * params: { page, size, q, pageFilter, energized, subject }
 */
async function fetchProjectEquipments({ queryKey }) {
  const [_key, projectId, params] = queryKey;

  const res = await axios.get(`/api/v1/projects/${projectId}/equipments`, {
    params: {
      // pagination (always send; server expects it for paged data)
      page: params?.page ?? 1,
      size: params?.size ?? 9,

      // filters
      q: params?.q ?? "",
      pageFilter: params?.pageFilter ?? "all",
      energized: params?.energized ?? "all",
      subject: params?.subject ?? "all",
    },
  });

  return res.data;
}

/**
 * @param {string} projectId
 * @param {{
 *  page?: number,
 *  size?: number,
 *  q?: string,
 *  pageFilter?: "all"|"normal"|"emergency",
 *  energized?: "all"|"on"|"off",
 *  subject?: string,
 *  enabled?: boolean
 * }} options
 */
export function useProjectEquipments(projectId, options = {}) {
  const {
    page = 1,
    size = 9,
    q = "",
    pageFilter = "all",
    energized = "all",
    subject = "all",
    enabled = true,
  } = options;

  return useQuery({
    queryKey: [
      "projectEquipments",
      projectId,
      { page, size, q, pageFilter, energized, subject },
    ],
    queryFn: fetchProjectEquipments,
    enabled: !!projectId && enabled,

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    placeholderData: keepPreviousData, // v5: smooth paging/filter changes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
