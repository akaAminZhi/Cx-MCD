import PropTypes from "prop-types";

function Input({ id, type, value, autoComplete, onChange, ...props }) {
  return (
    <input
      className="border border-gray-300 bg-gray-50 rounded-md py-2 px-4 shadow-md disabled:bg-gray-200"
      type={type}
      id={id}
      // This makes this form better for password managers
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      {...props}
    ></input>
  );
}

Input.propTypes = {
  id: PropTypes.any,
  type: PropTypes.any,
  value: PropTypes.any,
  autoComplete: PropTypes.any,
  onChange: PropTypes.any,
};
export default Input;
