import { useQuery } from "@tanstack/react-query";
import { getDevicesBySearch } from "../../services/apiDevices";

export function useSearchDevices(input, project_id) {
  const {
    data: results = [],
    isFetching,
    error,
  } = useQuery({
    queryKey: ["search", project_id, input],
    queryFn: () => getDevicesBySearch(input, project_id),
    enabled: Boolean(input),
    staleTime: 60000,
    placeholderData: (previous) => previous,
  });
  return { results, isFetching, error };
}
