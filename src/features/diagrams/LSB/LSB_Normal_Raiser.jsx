import React, { useState, useMemo } from "react";
import Transformer from "../../../ui/Transformer";
import Arrow_line from "../../../ui/Arrow_line";
import Panelboard from "../../../ui/Panelboard";
import useProjecDevices from "../../../hooks/useProjectDevices";
import Spinner from "../../../ui/Spinner";
import PolylineCable from "../../../ui/PolylineCable";
import BusLine from "../../../ui/BusLine";
import CableBridgesArc from "../../../ui/CableBridgesArc";
import Breaker from "../../../ui/Breaker";
import BusBreaker from "../../../ui/BusBreaker";

function LSB_Normal_Raiser({
  onNodeEnter,
  onNodeMove,
  onNodeLeave,
  onNodeClick,
  highlightDeviceId,
}) {
  // 1️⃣ 所有 hooks 放最上面，顺序每次 render 都一样
  const { data, isLoading, error } = useProjecDevices("lsb");

  // 多个可以同时展开
  const [expandedCableIds, setExpandedCableIds] = useState(() => new Set());

  // data 还没来时，Equipement 就是空数组，避免 undefined 报错
  const Equipement = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((item) => item.file_page === 1);
  }, [data]);

  const deviceMap = useMemo(() => {
    const m = {};
    Equipement.forEach((d) => {
      m[d.id] = d;
    });
    return m;
  }, [Equipement]);

  const selected =
    highlightDeviceId && Equipement.find((d) => d.id === highlightDeviceId);
  const rect = selected?.rect_px;

  const {
    panelboards,
    transforms,
    room_line,
    level_line,
    wall,
    cable,
    bus,
    cablesData,
    breakers,
    busBreakers,
  } = useMemo(() => {
    const panelboards = [];
    const transforms = [];
    const room_line = [];
    const level_line = [];
    const wall = [];
    const cable = [];
    const bus = [];
    const breakers = [];
    const busBreakers = [];

    Equipement.forEach((item) => {
      switch (item.subject) {
        case "panel board":
          panelboards.push(item);
          break;
        case "transformer":
          transforms.push(item);
          break;
        case "Room Line":
          room_line.push(item);
          break;
        case "Level Line":
          level_line.push(item);
          break;
        case "Wall":
          wall.push(item);
          break;
        case "PolyLine":
          cable.push(item);
          break;
        case "Breaker":
          breakers.push(item);
          break;
        case "Bus Breaker":
          busBreakers.push(item);
          break;
        case "Bus":
        case "Bus Duct":
          bus.push(item);
          break;
        default:
          break;
      }
    });

    const cablesData = cable.map((it) => ({
      id: it.id,
      points: it.polygon_points_px,
      color: "#111",
      width: 4,
      z: 0,
    }));

    return {
      panelboards,
      transforms,
      room_line,
      level_line,
      wall,
      cable,
      bus,
      cablesData,
      breakers,
      busBreakers,
    };
  }, [Equipement]);

  // 2️⃣ hooks 全部声明完之后，再根据 isLoading 决定渲染什么
  if (isLoading) return <Spinner />;

  // 点击某条 cable：如果已展开就收起；没展开就加入集合
  const handleCableClick = (id) => {
    setExpandedCableIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id); // 如果不想收起，就把这两行删掉
      } else {
        next.add(id);
      }
      return next;
    });
    onNodeLeave?.();
  };

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
          energizedToday={item.energized_today}
          onClick={() => onNodeClick?.(item)}
          onMouseEnter={(e) =>
            onNodeEnter?.(e, {
              ...item,
              tooltip: `${item.text} • ${
                item.energized ? "Energized" : "De-energized"
              }`,
            })
          }
          onMouseMove={(e) =>
            onNodeMove?.(e, {
              ...item,
              tooltip: `${item.text} • ${
                item.energized ? "Energized" : "De-energized"
              }`,
            })
          }
          onMouseLeave={() => onNodeLeave?.()}
        />
      ))}

      {transforms.map((item) => (
        <Transformer
          key={item.id}
          name={item.text}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
          energized={item.energized}
          energizedToday={item.energized_today}
          onClick={() => onNodeClick?.(item)}
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

      {/* ⭐ Cable 渲染：可以展开多条 */}
      {cable.map((item) => {
        const expanded = expandedCableIds.has(item.id);
        const hasShort =
          item.short_segments_px &&
          Array.isArray(item.short_segments_px.head) &&
          Array.isArray(item.short_segments_px.tail);

        const onCableClick = () => handleCableClick(item.id);

        // 没有 short 或者已经展开 → 画整条线（不查 from/to）
        if (!hasShort || expanded) {
          return (
            <PolylineCable
              key={item.id}
              id={item.id}
              points={item.polygon_points_px}
              energized={item.energized}
              energizedToday={item.energized_today}
              onClick={onCableClick}
            />
          );
        }

        // 只有需要画 head/tail 时才从 map 里拿设备
        const fromDevice = deviceMap[item.from];
        const toDevice = deviceMap[item.to];

        return (
          <React.Fragment key={item.id}>
            {/* head → to XXX */}
            <PolylineCable
              id={`${item.id}-head`}
              points={item.short_segments_px.head}
              energized={item.energized}
              energizedToday={item.energized_today}
              arrowType="head"
              showLabel={false} // ⭐ 不画 text，只用 tooltip
              onClick={onCableClick}
              onMouseEnter={(e) =>
                onNodeEnter?.(e, {
                  ...item,
                  tooltip: toDevice?.text
                    ? `to ${toDevice.text}`
                    : "to (unknown device)",
                })
              }
              onMouseMove={(e) =>
                onNodeMove?.(e, {
                  ...item,
                  tooltip: toDevice?.text
                    ? `to ${toDevice.text}`
                    : "to (unknown device)",
                })
              }
              onMouseLeave={() => onNodeLeave?.()}
            />

            {/* tail → from XXX */}
            <PolylineCable
              id={`${item.id}-tail`}
              points={item.short_segments_px.tail}
              energized={item.energized}
              energizedToday={item.energized_today}
              arrowType="tail"
              showLabel={false} // ⭐ 同样不画 text
              onClick={onCableClick}
              onMouseEnter={(e) =>
                onNodeEnter?.(e, {
                  ...item,
                  tooltip: fromDevice?.text
                    ? `from ${fromDevice.text}`
                    : "from (unknown device)",
                })
              }
              onMouseMove={(e) =>
                onNodeMove?.(e, {
                  ...item,
                  tooltip: fromDevice?.text
                    ? `from ${fromDevice.text}`
                    : "from (unknown device)",
                })
              }
              onMouseLeave={() => onNodeLeave?.()}
            />
          </React.Fragment>
        );
      })}

      {bus.map((item) => (
        <BusLine
          key={item.id}
          id={item.id}
          rect_px={item.rect_px}
          energized={item.energized}
        />
      ))}

      <CableBridgesArc cables={cablesData} bgColor="#fff" radius={2} gap={4} />
      {breakers.map((item) => (
        <Breaker
          key={item.id}
          id={item.id}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
          state={item.energized ? "CLOSE" : "OPEN"}
          onClick={() => onNodeClick?.(item)}
        />
      ))}
      {busBreakers.map((item) => (
        <BusBreaker
          key={item.id}
          id={item.id}
          x1={item.rect_px[0]}
          y1={item.rect_px[1]}
          x2={item.rect_px[2]}
          y2={item.rect_px[3]}
          state={item.energized ? "CLOSE" : "OPEN"}
          onClick={() => onNodeClick?.(item)}
        />
      ))}
      {Array.isArray(rect) && rect.length === 4 && (
        <>
          <defs>
            <filter id="hl-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g pointerEvents="none">
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
