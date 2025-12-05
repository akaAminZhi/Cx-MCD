import React from "react";
// import Equipement from "../../../data/equipment0.json";
import Transformer from "../../../ui/Transformer";
import Arrow_line from "../../../ui/Arrow_line";
import Panelboard from "../../../ui/Panelboard";
import useProjecDevices from "../../../hooks/useProjectDevices";
import Spinner from "../../../ui/Spinner";
import PolylineCable from "../../../ui/PolylineCable";
import BusLine from "../../../ui/BusLine";
import Cable from "../../../data/equipment_info_bus_to_panel.json";
// import CableBridges from "../../../ui/CableBridges";
import CableBridgesArc from "../../../ui/CableBridgesArc";
function LSB_Normal_Raiser({
  onNodeEnter,
  onNodeMove,
  onNodeLeave,
  onNodeClick,
  highlightDeviceId,
}) {
  const { data, isLoading, error } = useProjecDevices("lsb");
  if (isLoading) return <Spinner></Spinner>;

  const Equipement = data.data.filter((item) => item.file_page === 1);

  const selected = Equipement.find((d) => d.id === highlightDeviceId);
  const rect = selected?.rect_px;

  const panelboards = Equipement.filter(
    (item) => item.subject === "panel board"
  );
  const transforms = Equipement.filter(
    (item) => item.subject === "transformer"
  );
  const room_line = Equipement.filter((item) => item.subject === "Room Line");
  const level_line = Equipement.filter((item) => item.subject === "Level Line");
  const wall = Equipement.filter((item) => item.subject === "Wall");

  const cable = Cable.filter((item) => item.subject === "PolyLine");
  const bus = Cable.filter((item) => item.subject === "Bus");
  const cablesData = cable.map((it) => ({
    id: it.id,
    points: it.polygon_points_px, // ✅ CableBridges/PolylineCable 需要的字段名
    color: "#111",
    width: 4,
    z: 0,
  }));
  return (
    <>
      {/* <PanelboardGroup  panelboards={panelboards} /> */}
      {panelboards.map((item) => (
        <Panelboard
          key={item.id}
          name={item.text}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
          energized={item.energized}
          energizedToday={item.energized_today}
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
      {cable.map((item) => (
        <PolylineCable
          key={item.id}
          id={item.id}
          points={item.polygon_points_px}
        />
      ))}
      {bus.map((item) => (
        <BusLine key={item.id} id={item.id} rect_px={item.rect_px} />
      ))}
      {/* <CableBridges cables={cablesData} bgColor="#fff" /> */}
      <CableBridgesArc cables={cablesData} bgColor="#fff" radius={2} gap={4} />
      {Array.isArray(rect) && rect.length === 4 && (
        <>
          <defs>
            {/* 发光滤镜（可选） */}
            <filter id="hl-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g pointerEvents="none">
            {/* 实线高亮框 */}
            <rect
              x={rect[0]}
              y={rect[1]}
              width={rect[2] - rect[0]}
              height={rect[3] - rect[1]}
              fill="none"
              stroke="red"
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
              filter="url(#hl-glow)"
            />
            {/* 叠一层虚线，让效果更明显（可选） */}
            <rect
              x={rect[0]}
              y={rect[1]}
              width={rect[2] - rect[0]}
              height={rect[3] - rect[1]}
              fill="none"
              stroke="white"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="6 6"
              opacity={0.9}
            />
          </g>
        </>
      )}
    </>
  );
}

export default React.memo(LSB_Normal_Raiser);
