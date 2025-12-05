import PropTypes from "prop-types";
import { getGlobalProjects } from "../utils/globalProjects";

import { HiBattery0, HiShieldExclamation } from "react-icons/hi2";

function TaskTable({ title, tasks }) {
  const projects = getGlobalProjects();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-3">{title}</h3>
      <table className="w-full text-2xl text-left">
        <thead>
          <tr className="text-gray-500">
            <th className="py-1">Project</th>
            <th className="py-1">Device</th>
            <th className="py-1">Status</th>
            {/* <th className="py-1">Due</th> */}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr key={i} className="border-t">
              <td className="py-1">
                {projects.find((project) => project.id === t.project_id).name}
              </td>

              <td className="py-1">{t.name}</td>
              <td className="py-1">
                {!t.energized ? (
                  <HiBattery0 className="w-10 h-10 text-orange-500" />
                ) : (
                  <HiShieldExclamation className="w-10 h-10 text-orange-500" />
                )}
              </td>
              {/* <td className="py-1">{t.due}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TaskTable.propTypes = { title: PropTypes.str, tasks: PropTypes.array };

export default TaskTable;
