import React from "react";
import ATS from "./ATS";
import Switchgear from "./Switchgear";

const PowerDiagram = () => {
  const drawCurvedLine = (x1, y1, x2, y2, offset = 80) => {
    const ctrlX1 = x1;
    const ctrlY1 = y1 + offset;
    const ctrlX2 = x2;
    const ctrlY2 = y2 - offset;

    return `M ${x1} ${y1} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${x2} ${y2}`;
  };
  return (
    <svg width="900" height="500">
      {/* Switchgears */}
      <Switchgear x={200} y={40} />
      <Switchgear x={500} y={40} />

      {/* ATS boxes */}
      <ATS x={100} y={300} activeSource="main" />
      <ATS x={250} y={300} activeSource="backup" />
      <ATS x={400} y={300} activeSource="main" />
      <ATS x={550} y={300} activeSource="backup" />

      {/* Curved lines from Switchgear 1 */}
      <path
        d={drawCurvedLine(250, 240, 130, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={drawCurvedLine(250, 240, 280, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={drawCurvedLine(250, 240, 430, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={drawCurvedLine(250, 240, 580, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />

      {/* Curved lines from Switchgear 2 */}
      <path
        d={drawCurvedLine(550, 240, 130, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6"
      />
      <path
        d={drawCurvedLine(550, 240, 280, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6"
      />
      <path
        d={drawCurvedLine(550, 240, 430, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6"
      />
      <path
        d={drawCurvedLine(550, 240, 580, 300)}
        stroke="black"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6"
      />
    </svg>
  );
};

export default PowerDiagram;
