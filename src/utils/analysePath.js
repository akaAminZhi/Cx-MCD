import { getGlobalProjects } from "./globalProjects";

function getProjectNameById(id) {
  const projects = getGlobalProjects();
  for (let index = 0; index < projects.length; index++) {
    if (projects[index].id === Number(id)) return projects[index].name;
  }
  return "";
}
export function getCurrentPath(pathname) {
  const pathSegments = pathname.split("/").filter(Boolean);
  if (
    pathSegments[0] === "projects" ||
    (pathSegments[0] === "diagrams" && pathSegments.length > 1)
  ) {
    pathSegments[1] = getProjectNameById(pathSegments[1]);
    return pathSegments;
  }
  return pathSegments;
}
