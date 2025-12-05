import React from "react";
import Transformer from "../../../ui/Transformer";
import Arrow_line from "../../../ui/Arrow_line";
import GeneratorGroup from "../../../ui/GeneratorGroup";
import useProjecDevices from "../../../hooks/useProjectDevices";
import Spinner from "../../../ui/Spinner";
import Panelboard from "../../../ui/Panelboard";

import Cable from "../../../data/equipment_info_with_links.json";
import PolylineCable from "../../../ui/PolylineCable";
import BusLine from "../../../ui/BusLine";
function LSB_Emergency_Raiser({
  onNodeEnter,
  onNodeMove,
  onNodeLeave,
  onNodeClick,
}) {
  // console.log(Cable);
  const { data, isLoading, error } = useProjecDevices("lsb");
  if (isLoading) return <Spinner></Spinner>;
  const Equipement = data.data.filter((item) => item.file_page === 2);
  const panelboards = Equipement.filter(
    (item) => item.subject === "panel board"
  );
  const transforms = Equipement.filter(
    (item) => item.subject === "transformer"
  );
  const room_line = Equipement.filter((item) => item.subject === "Room Line");
  const level_line = Equipement.filter((item) => item.subject === "Level Line");
  const wall = Equipement.filter((item) => item.subject === "Wall");
  const generator = Equipement.filter((item) => item.subject === "generator");
  const cable = Cable.filter((item) => item.subject === "PolyLine");
  const bus = Cable.filter((item) => item.subject === "Bus");
  // console.log(generator)
  return (
    <>
      {panelboards.map((item) => (
        <Panelboard
          key={item.id}
          name={item.text}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
          energized={item.energized}
          onClick={() => onNodeClick?.(item)}
          // 命中层上的鼠标事件：传 event + payload
          onMouseEnter={(e) =>
            onNodeEnter?.(e, {
              ...item,
              tooltip: `${item.text} • ${item.energized ? "Energized" : "De-energized"}`,
            })
          }
          onMouseMove={(e) =>
            onNodeMove?.(e, {
              ...item,
              tooltip: `${item.text} • ${item.energized ? "Energized" : "De-energized"}`,
            })
          }
          onMouseLeave={() => onNodeLeave?.()}
        />
      ))}
      {/* <Transformer/> */}
      {transforms.map((item) => (
        <Transformer
          key={item.id}
          name={item.text}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
        />
      ))}
      {generator.map((item) => (
        <GeneratorGroup
          key={item.id}
          name={item.text}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
        />
      ))}
      {room_line.map((item) => (
        <Arrow_line
          key={item.id}
          label={item.comments}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[1]}
        />
      ))}
      {level_line.map((item) => (
        <Arrow_line
          key={item.id}
          label={item.comments}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[1]}
        />
      ))}
      {wall.map((item) => (
        <Arrow_line
          key={item.id}
          label={item.comments}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[0]}
          y2={item.rect_px[3]}
        />
      ))}
    </>
  );
}

export default React.memo(LSB_Emergency_Raiser);
