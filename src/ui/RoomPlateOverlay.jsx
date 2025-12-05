import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function RoomPlateOverlay({
  imageSrc,
  jsonPath,
  highlightedRooms = new Set(),
  onRoomClick,
}) {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    fetch(jsonPath)
      .then((res) => res.json())
      .then(setBoxes);
  }, [jsonPath]);

  return (
    <>
      <image href={imageSrc} x="0" y="0" />
      {boxes.map((box) => {
        const isHighlight = highlightedRooms.has(box.room_plate);
        return (
          <rect
            key={box.room_plate}
            x={box.x1}
            y={box.y1}
            width={box.x2 - box.x1}
            height={box.y2 - box.y1}
            stroke={isHighlight ? "red" : "blue"}
            strokeWidth={isHighlight ? 3 : 1}
            fill={isHighlight ? "rgba(255,0,0,0.8)" : "transparent"}
            className="cursor-pointer transition-all hover:fill-red-500 opacity-20 duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onRoomClick?.(box.room_plate);
            }}
          >
            <title>{box.room_plate}</title>
          </rect>
        );
      })}
    </>
  );
}

RoomPlateOverlay.propTypes = {
  imageSrc: PropTypes.string,
  jsonPath: PropTypes.string,
  highlightedRooms: PropTypes.string,
  onRoomClick: PropTypes.any,
};
export default RoomPlateOverlay;
