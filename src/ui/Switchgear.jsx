import React from "react";
import FlashIcon from "./FlashIcon";
import PropTypes from "prop-types";

export default function Switchgear({
  sections = [3, 2, 2, 3],
  energized = false,
  x = 0,
  y = 0,
  name,
}) {
  const SECTION_WIDTH = 80;
  const SECTION_HEIGHT = 200;
  const BREAKER_HEIGHT = 50;
  const BREAKER_SPACING = 10;
  const SECTION_SPACING = 10;
  const ENCLOSURE_PADDING = 20;
  const FLASH_SPACE = 80;

  const sectionCount = sections.length;
  const totalWidth =
    sectionCount * (SECTION_WIDTH + SECTION_SPACING) -
    SECTION_SPACING +
    ENCLOSURE_PADDING * 2;
  const enclosureHeight = SECTION_HEIGHT + ENCLOSURE_PADDING * 2;
  const totalSvgHeight = enclosureHeight + FLASH_SPACE;

  return (
    <>
      {/* <svg width={totalWidth + x} height={totalSvgHeight + y}> */}
      <g transform={`translate(${x}, ${y})`}>
        {/* Glow filter */}

        {energized && <FlashIcon x={totalWidth / 2} y={50} />}

        {/* Enclosure */}
        <rect
          x={0}
          y={FLASH_SPACE}
          width={totalWidth}
          height={enclosureHeight}
          fill="#f0f0f0"
          stroke="#333"
          strokeWidth={2}
          rx={10}
        />
        <text
          x={totalWidth / 2}
          y={FLASH_SPACE - 5}
          textAnchor="middle"
          fontSize={20}
          fill="#333"
        >
          {name}
        </text>
        {/* Sections */}
        {sections.map((breakerCount, sectionIndex) => {
          const sectionX =
            ENCLOSURE_PADDING +
            sectionIndex * (SECTION_WIDTH + SECTION_SPACING);
          const sectionY = ENCLOSURE_PADDING + FLASH_SPACE;

          return (
            <g key={sectionIndex}>
              {/* Section box */}
              <rect
                x={sectionX}
                y={sectionY}
                width={SECTION_WIDTH}
                height={SECTION_HEIGHT}
                fill="#ffffff"
                stroke="#666"
                strokeWidth={1.5}
              />

              {/* Breakers */}
              {Array.from({ length: breakerCount }).map((_, breakerIndex) => {
                const totalBreakerArea =
                  BREAKER_HEIGHT * 3 + BREAKER_SPACING * 2;
                const offsetY =
                  (SECTION_HEIGHT - totalBreakerArea) / 2 +
                  (BREAKER_HEIGHT + BREAKER_SPACING) * breakerIndex;

                return (
                  <rect
                    key={breakerIndex}
                    x={sectionX + 10}
                    y={sectionY + offsetY}
                    width={SECTION_WIDTH - 20}
                    height={BREAKER_HEIGHT}
                    fill="#cce5ff"
                    stroke="#004080"
                    strokeWidth={1}
                    rx={4}
                  />
                );
              })}

              {/* Section label */}
              <text
                x={sectionX + SECTION_WIDTH / 2}
                y={sectionY + SECTION_HEIGHT + 15}
                textAnchor="middle"
                fontSize={12}
                fill="#333"
              >
                Section {sectionIndex + 1}
              </text>
            </g>
          );
        })}
      </g>
      {/* </svg> */}
    </>
  );
}
Switchgear.propTypes = {
  name: PropTypes.string,
  sections: PropTypes.array,
  x: PropTypes.number,
  y: PropTypes.number,
  energized: PropTypes.bool,
};
