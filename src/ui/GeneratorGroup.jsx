/**
 * GeneratorGroup.jsx — 支持 x1, y1, x2, y2 的版本
 */
import FlashIcon from "./FlashIcon";
import PropTypes from "prop-types";

export default function GeneratorGroup({
  x1,
  y1,
  x2,
  y2,
  stroke = "currentColor",
  strokeWidth = 5,
  energized = false,
  name = "G1",
  ...rest
}) {
  // 目标矩形宽高
  const targetW = Math.max(0, x2 - x1);
  const targetH = Math.max(0, y2 - y1);

  // 原图的“基准包围盒”（根据路径和元素范围估算）
  // x 范围约 32~260，y 范围约 8~200+
  const BASE = { minX: 32, minY: 8, width: 228 - 32, height: 200 };

  // 按比例缩放并居中
  const s = Math.min(targetW / BASE.width, targetH / BASE.height)*2;
  const drawW = BASE.width * s;
  const drawH = BASE.height * s;
  const offsetX = x1 + (targetW - drawW) / 2;
  const offsetY = y1 + (targetH - drawH) / 2;

  return (
    <>
    {/* 透明命中层 */}
    <rect
        x={x1}
        y={y1}
        width={targetW}
        height={targetH}
        fill="white"
        fillOpacity="0"
        pointerEvents="all"
        style={{ cursor: "pointer" }}
        onClick={rest.onClick}
        onMouseEnter={rest.onMouseEnter}
        onMouseLeave={rest.onMouseLeave}
      />
    <g
      transform={`translate(${offsetX} ${offsetY}) scale(${s}) translate(${-BASE.minX} ${-BASE.minY})`}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={` ${energized ? "fill-yellow-300" : "fill-none"}`}
      {...rest}
      >
      {/* 闪电图标 */}
      {energized && <FlashIcon x={130} y={-20} />}

      {/* 名称标签 */}
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

      {/* ── 机壳外框 ──────────────── */}
      <path d="M32 48 H228 a16 16 0 0 1 16 16 V176 H72 a24 24 0 0 1 -24 -24 V48 Z" />

      {/* ── 顶部把手 ──────────────── */}
      <path d="M32 48 V32 H228 V48" />
      <rect x="168" y="8" width="44" height="24" rx="4" />

      {/* ── 操作面板 ──────────────── */}
      <rect x="92" y="76" width="68" height="32" rx="4" />
      <circle cx="186" cy="92" r="12" />
      <circle cx="218" cy="92" r="12" />

      {/* ── 分隔线 + 指示灯 ───────── */}
      <line x1="105" y1="132" x2="228" y2="132" />
      <circle cx="244" cy="132" r="4" />

      {/* ── 闪电符号 (新版) ───────── */}
      <polyline
        transform={"translate(-20 0)"}
        points="72 132 104 92 104 120 132 120 104 158 104 132 72 132"
        />

      {/* ── 散热栅 ──────────────── */}
      {[148, 164, 170].map((yPos) => (
        <line key={yPos} x1="108" y1={yPos} x2="172" y2={yPos} />
      ))}

      {/* ── 底座脚 ──────────────── */}
      <rect x="72" y="176" width="56" height="24" rx="4" />

      {/* ── 车轮 ──────────────── */}
      <circle cx="228" cy="176" r="36" />
      <circle cx="228" cy="176" r="14" />
    </g>
</>
  );
}

GeneratorGroup.propTypes = {
  name: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  energized: PropTypes.bool,
};
