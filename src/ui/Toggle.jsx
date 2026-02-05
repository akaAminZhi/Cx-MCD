import React from "react";
import PropTypes from "prop-types";

/**
 * iOS-like Toggle (no overflow / no fixed translate)
 * - 使用 absolute + left 计算，避免不同缩放/字体导致出界
 * - 更圆润、更柔和阴影
 */
export default function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label = "toggle",
  className = "",
}) {
  const cfg = {
    sm: { trackW: 48, trackH: 28, pad: 2, thumb: 20 },
    md: { trackW: 56, trackH: 32, pad: 2, thumb: 24 },
    lg: { trackW: 76, trackH: 40, pad: 3, thumb: 32 },
  }[size] ?? { trackW: 56, trackH: 32, pad: 2, thumb: 24 };

  const { trackW, trackH, pad, thumb } = cfg;

  const handleChange = (e) => {
    if (disabled) return;
    onChange?.(e.target.checked, e);
  };

  const trackBg = disabled
    ? "bg-slate-200"
    : checked
      ? "bg-indigo-600"
      : "bg-slate-300";

  // 计算 thumb 的 left：off=pad，on=trackW - pad - thumb
  const leftPx = checked ? trackW - pad - thumb : pad;

  return (
    <label
      className={`inline-flex items-center select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
      aria-label={label}
      title={disabled ? "Disabled" : undefined}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={!!checked}
        onChange={handleChange}
        disabled={disabled}
        aria-checked={!!checked}
      />

      {/* Track */}
      <span
        className={`
          relative inline-flex items-center rounded-full overflow-hidden
          ${trackBg}
          transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200
        `}
        style={{ width: trackW, height: trackH }}
        aria-hidden
      >
        {/* subtle inner highlight */}
        <span
          className="absolute inset-[1px] rounded-full bg-white/20 pointer-events-none"
          aria-hidden
        />

        {/* Thumb */}
        <span
          className={`
            absolute top-1/2 -translate-y-1/2
            rounded-full bg-white
            shadow-[0_6px_14px_rgba(0,0,0,0.18)]
            ring-1 ring-black/5
            transition-[left] duration-200 ease-out
          `}
          style={{
            width: thumb,
            height: thumb,
            left: leftPx,
          }}
          aria-hidden
        >
          {/* specular highlight */}
          <span
            className="absolute inset-0 rounded-full bg-gradient-to-b from-white/70 to-white/10 pointer-events-none"
            aria-hidden
          />
        </span>
      </span>
    </label>
  );
}

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  label: PropTypes.string,
  className: PropTypes.string,
};
