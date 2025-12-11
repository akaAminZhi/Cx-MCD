/**
 * TransformerGroup.jsx（按 x1,y1,x2,y2 适配）
 * 使用示例（在外层 <svg> 内）：
 * <Transformer
 *   x1={100} y1={80} x2={260} y2={260}
 *   stroke="#000" strokeWidth={5}
 *   energized={true}
 *   name="XFMR-1"
 * />
 */
import React from "react";
import FlashIcon from "./FlashIcon";
import PropTypes from "prop-types";
import { COLOR_MAP } from "../utils/constans";

function Transformer({
  x1,
  y1,
  x2,
  y2,
  stroke = "currentColor",
  strokeWidth = 5,
  energized = false,
  energizedToday,
  name,
  ...rest
}) {
  // 目标矩形
  const targetW = Math.max(0, x2 - x1);
  const targetH = Math.max(0, y2 - y1);

  const getFillColor = () => {
    if (energizedToday) return COLOR_MAP.orange500;
    if (energized) return COLOR_MAP.red500;
    return COLOR_MAP.gray50;
  };
  // 原图的“基准包围盒”（根据现有元素的最外范围估算）
  // x: [20, 240] => width = 220
  // y: [16, 232] => height = 216 （顶帽 r=6 => 22-6=16；机脚 208+24=232）
  const BASE = { minX: 20, minY: 16, width: 220, height: 216 };

  // 统一缩放（等比），并把内容在目标矩形里居中
  const s =
    Math.min(targetW / BASE.width || 0, targetH / BASE.height || 0) * 1.5;
  const drawW = BASE.width * s;
  const drawH = BASE.height * s;
  const offsetX = x1 + (targetW - drawW) / 2;
  const offsetY = y1 + (targetH - drawH) / 2 - 15;

  /* 顶部 3 个套管 (bushings) 的中心 x 坐标（基于原图坐标系） */
  const bushingXs = [86, 130, 174];
  /* 每个套管的水平“波纹”起始 y（基于原图坐标系） */
  const bushingLines = [30, 38, 46, 54, 62, 70];

  return (
    <>
      <rect
        x={x1}
        y={y1}
        width={targetW}
        height={targetH}
        fill={"white"}
        fillOpacity="0"
        pointerEvents="all"
        style={{ cursor: "pointer" }}
        // 事件写这里
        onClick={rest.onClick}
        onMouseEnter={rest.onMouseEnter}
        onMouseLeave={rest.onMouseLeave}
      />
      <g
        // 先把图形移动到目标矩形里（带居中），再按 s 等比缩放，
        // 最后把原图坐标的 minX/minY 平移到 (0,0)，让左上角对齐
        transform={`translate(${offsetX} ${offsetY}) scale(${s}) translate(${-BASE.minX} ${-BASE.minY})`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...rest}
      >
        {energized && <FlashIcon x={40} y={50} />}

        {/* ──────── 顶部横梁 ──────── */}
        <rect x="48" y="78" width="164" height="10" rx="3" />

        {/* ──────── 机体主箱 ──────── */}
        <rect x="48" y="88" width="164" height="120" rx="10" />

        {/* ──────── 两侧散热片 ────── */}
        <rect x="20" y="100" width="28" height="96" rx="6" />
        <rect x="212" y="100" width="28" height="96" rx="6" />

        {/* ──────── 机脚 ─────────── */}
        <rect x="72" y="208" width="40" height="24" rx="4" />
        <rect x="148" y="208" width="40" height="24" rx="4" />

        {/* ──────── 面板窗口 ─────── */}
        <rect x="72" y="118" width="120" height="64" rx="6" />

        <text
          x={130}
          y={150}
          textAnchor="middle"
          fontSize="14"
          fill="#333"
          strokeWidth={1}
          className="text-4xl"
        >
          {name}
        </text>

        {/* ──────── 三个高压套管 ── */}
        {bushingXs.map((cx) => (
          <g key={cx}>
            {/* 小帽 */}
            <circle cx={cx} cy={22} r={6} />
            {/* 多层波纹 (用平行线模拟) */}
            {bushingLines.map((y0) => (
              <line key={y0} x1={cx - 14} y1={y0} x2={cx + 14} y2={y0} />
            ))}
            {/* 立柱 */}
            <line x1={cx} y1={78} x2={cx} y2={74} />
          </g>
        ))}
      </g>
    </>
  );
}

Transformer.propTypes = {
  name: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number, // ← 修正为 number

  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,

  energized: PropTypes.bool,
};

function isEqual(prev, next) {
  return (
    prev.x1 === next.x1 &&
    prev.y1 === next.y1 &&
    prev.x2 === next.x2 &&
    prev.y2 === next.y2 &&
    prev.stroke === next.stroke &&
    prev.strokeWidth === next.strokeWidth &&
    prev.energized === next.energized &&
    prev.name === next.name
  );
}

export default React.memo(Transformer, isEqual);
