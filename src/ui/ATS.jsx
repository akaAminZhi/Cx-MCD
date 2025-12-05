import React from "react";
import FlashIcon from "./FlashIcon";
import PropTypes from "prop-types";

export default function ATS({
  x = 0,
  y = 0,
  width = 100,
  height = 120,
  energized = false,
  name,
}) {
  const centerX = 0 + width / 2;
  const topY = 0;
  const bottomY = 0 + height;
  const armLength = 30;
  const colorMap = {
    gray50: "#f9fafb",
    yellow300: "#fde047",
  };
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* ATS enclosure */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        // fill="#ffffff"
        stroke="#444"
        strokeWidth={2}
        rx={8}
        // className={energized ? "fill-yellow-300" : "fill-none"}
        fill={energized ? colorMap.yellow300 : colorMap.gray50}
      />

      {/* Y-shape lines */}
      <line
        x1={centerX - armLength}
        y1={topY + 20}
        x2={centerX}
        y2={0 + height / 2}
        stroke="#000"
        strokeWidth={2}
      />
      <line
        x1={centerX + armLength}
        y1={topY + 20}
        x2={centerX}
        y2={0 + height / 2}
        stroke="#000"
        strokeWidth={2}
      />
      <line
        x1={centerX}
        y1={0 + height / 2}
        x2={centerX}
        y2={bottomY - 20}
        stroke="#000"
        strokeWidth={2}
      />

      <text
        x={centerX}
        y={0 - 10}
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#333"
      >
        {name}
      </text>
      {energized && <FlashIcon x={centerX} y={0 - 20} />}
    </g>
  );
}
ATS.propTypes = {
  name: PropTypes.string,
  width: PropTypes.number,
  x: PropTypes.number,
  height: PropTypes.number,
  y: PropTypes.number,
  energized: PropTypes.bool,
};
