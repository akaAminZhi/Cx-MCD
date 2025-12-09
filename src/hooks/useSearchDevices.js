// src/features/devices/useSearchDevices.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

async function searchDevices({ q, page = 1, size = 20, project, file_page }) {
  const res = await axios.get("/api/v1/devices/search", {
    params: { q, page, size, project, file_page },
  });
  return res.data; // 期望是一个数组或 {items:[], total:...}
}

export function useSearchDevices({
  q,
  page = 1,
  size = 20,
  project,
  file_page,
}) {
  const debouncedQ = useDebounce(q, 300);

  const queryParams = useMemo(
    () => ({ q: debouncedQ, page, size, project, file_page }),
    [debouncedQ, page, size, project, file_page]
  );

  return useQuery({
    queryKey: ["device-search", project, file_page, page, size, debouncedQ],
    queryFn: () => searchDevices(queryParams),
    enabled: !!debouncedQ && debouncedQ.length >= 2 && !!project,
    staleTime: 60 * 1000,
  });
}
export default useSearchDevices;
