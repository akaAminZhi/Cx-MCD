import { useNavigate } from "react-router";
import Spinner from "../../ui/Spinner";
import { getGlobalProjects } from "../../utils/globalProjects";
import { useProjectDeviceStats } from "../devices/useProjectDeviceStats";
import DeviceStats from "./DeviceStats";
import TaskTable from "../../ui/TaskTable";
import { useTodayTask } from "./useTodayTask";

function DashboardLayout() {
  const { isPending, projectDeviceStats } = useProjectDeviceStats();
  const { isPending: getTodayTaskPending, todayTasks } = useTodayTask();
  const navigate = useNavigate();
  function handleClick(id) {
    navigate(`/projects/${id}`);
  }

  if (isPending || getTodayTaskPending) return <Spinner></Spinner>;
  const AllProject = getGlobalProjects();
  return (
    <div className="grid grid-rows-2 gap-6">
      <div>
        {projectDeviceStats.map((projectStats) => {
          return (
            <div
              className="hover:shadow-2xl hover:rounded-3xl hover:border hover:scale-103 hover:cursor-pointer"
              key={projectStats.project_id}
              onClick={() => handleClick(projectStats.project_id)}
            >
              <p className="font-bold text-indigo-700 px-4">
                {
                  AllProject.find(
                    (project) => project.id === projectStats.project_id
                  ).name
                }
              </p>
              <DeviceStats devices={projectStats}></DeviceStats>
            </div>
          );
        })}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <TaskTable title="Today Tasks" tasks={todayTasks} />

        <TaskTable title="Delayed Tasks" tasks={[]} />
      </div>
    </div>
  );
}

export default DashboardLayout;
