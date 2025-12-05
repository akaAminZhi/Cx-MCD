import { useQuery } from "@tanstack/react-query";
import { getTodayTask } from "../../services/apiDevices";

export function useTodayTask() {
  const { data: todayTasks, isPending } = useQuery({
    queryKey: ["TodayTasks"],
    queryFn: getTodayTask,
  });
  return { todayTasks, isPending };
}
