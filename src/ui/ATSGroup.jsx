import ATS from "./ATS";

function ATSGroup({ ATSs = [], devices = new Map() }) {
  return ATSs.map((item) => {
    const device = devices?.get(item.name);

    return (
      <ATS
        key={item.name}
        name={item.name}
        x={item.x}
        y={item.y}
        energized={device?.energized ?? false}
      />
    );
  });
}

export default ATSGroup;
