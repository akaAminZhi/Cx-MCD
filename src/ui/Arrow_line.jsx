import PropTypes from "prop-types";

const Arrow_line = ({ x1, y1, x2, y2, label }) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      {/* The dashed line with arrows on both ends */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#555"
        strokeWidth={2}
        strokeDasharray="8,4"
      />

      {/* Optional label text */}
      {label && (
        <text
          x={midX}
          y={midY + 25}
          textAnchor="middle"
          fill="#555"
          fontSize="30"
        >
          {label}
        </text>
      )}
    </g>
  );
};
Arrow_line.propTypes = {
  label: PropTypes.string,
  x2: PropTypes.number,
  x1: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number,
  energized: PropTypes.bool,
};
export default Arrow_line;
