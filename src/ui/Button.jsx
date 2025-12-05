import PropTypes from "prop-types";

function Button({
  size = "medium",
  variation = "primary",
  selected = false,
  children,
  ...props
}) {
  const sizes = {
    small: "text-xl py-1 px-2 uppercase font-semibold text-center",
    medium: "text-2xl py-3 px-4 font-medium",
    large: "text-3xl py-3 px-5 font-medium",
  };

  const variations = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-700",
    secondary:
      "text-stone-600 bg-stone-50 border border-stone-200 hover:bg-stone-100",
    danger: "text-red-100 bg-red-700 hover:bg-red-800",
    submitte:
      "text-green-100 bg-green-700 hover:bg-green-800 outline-green-700",
  };

  const selectedVariations = {
    primary: "bg-indigo-800",
    secondary: "bg-stone-200",
    danger: "bg-red-900",
    submitte: "bg-green-900",
  };
  return (
    <button
      className={` flex rounded shadow-sm border-none disabled:cursor-not-allowed
          ${sizes[size]}
          ${variations[variation]}
           ${selected ? selectedVariations[variation] : ""}
          `}
      {...props}
    >
      {children}
    </button>
  );
}
Button.propTypes = {
  size: PropTypes.string,
  children: PropTypes.node.isRequired,
  variation: PropTypes.string,
  selected: PropTypes.bool,
};
export default Button;
