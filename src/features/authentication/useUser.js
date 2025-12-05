import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return { user, isPending, isAuthenticated: user?.role === "authenticated" };
}
