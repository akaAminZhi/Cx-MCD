import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSubjectSteps(subject) {
  return useQuery({
    queryKey: ["subjectSteps", subject],
    enabled: !!subject,
    queryFn: async () => {
      const res = await axios.get(
        `/api/v1/subjects/${encodeURIComponent(subject)}/steps?active_only=true`
      );
      return res.data; // {subject,count,data:[...]}
    },
    staleTime: 60 * 1000,
  });
}
