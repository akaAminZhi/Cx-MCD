/**
 * UPSIconGroup.jsx
 * 用法：
 * <svg viewBox="0 0 260 220">
 *   <UPSIconGroup x={40} y={20} stroke="#000" strokeWidth={8} />
 * </svg>
 */
import FlashIcon from "./FlashIcon";
import PropTypes from "prop-types";
export default function UPS({
  x = 0,
  y = 0,
  stroke = "currentColor",
  strokeWidth = 5,
  energized = false,
  name = "UPS",
  ...rest
}) {
  const colorMap = {
    gray50: "#f9fafb",
    yellow300: "#fde047",
  };
  return (
    <g
      transform={`translate(${x} ${y}) scale(.7)`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      // className={energized ? "fill-yellow-300" : "fill-none"}
      fill={energized ? colorMap.yellow300 : colorMap.gray50}
      {...rest}
    >
      {energized && <FlashIcon x={40} y={-20} />}
      {/* Name label above */}
      <text
        x={130}
        y={0}
        textAnchor="middle"
        fontSize="14"
        fill="#333"
        strokeWidth={1}
        className="text-4xl"
      >
        {name}
      </text>
      {/* ─────────── 机壳外框 ─────────── */}
      <rect x="32" y="32" width="160" height="156" rx="12" />

      {/* ─────────── 顶部显示屏 ───────── */}
      <rect x="60" y="50" width="80" height="28" rx="4" />
      {/* 三个指示灯 */}
      <circle cx="154" cy="64" r="8" />
      <circle cx="176" cy="64" r="8" />

      {/* ─────────── 分隔线 ───────────── */}
      <line x1="32" y1="104" x2="192" y2="104" />

      {/* ─────────── 电池符号 ─────────── */}
      {/* 电池主体 */}
      <rect x="76" y="120" width="72" height="44" rx="6" />
      {/* 正极帽 */}
      <rect x="104" y="110" width="16" height="10" rx="2" />
      {/* 正负极线条 */}
      <line x1="92" y1="142" x2="132" y2="142" />
      <line x1="100" y1="150" x2="124" y2="150" />

      {/* ─────────── 底部散热栅 ───────── */}
      {/* {[170, 184, 198].map((yPos) => (
        <line key={yPos} x1="48" y1={yPos} x2="176" y2={yPos} />
      ))} */}
    </g>
  );
}
UPS.propTypes = {
  name: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.string,

  x: PropTypes.number,
  y: PropTypes.number,
  energized: PropTypes.bool,
};
