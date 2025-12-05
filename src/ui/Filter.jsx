import { useSearchParams } from "react-router";
import PropTypes from "prop-types";

function Filter({ filterFiled, options }) {
  const buttonStyle = `disabled:opacity-75 disabled:ring-indigo-600 disabled:bg-indigo-600 disabled:text-white disabled:ring disabled:cursor-not-allowed
     focus:ring-indigo-600 focus:bg-indigo-600 focus:text-white focus:ring 
     bg-white rounded-sm font-semibold text-xl px-2 py-1 transition-all duration-300 
     active:bg-indigo-600 active:text-indigo-200 hover:bg-indigo-600 hover:text-indigo-50`;
  const [searchParams, setSearchPatams] = useSearchParams();

  const selectValue = searchParams.get(filterFiled);
  function handleClick(value) {
    searchParams.set(filterFiled, value);
    if (searchParams.get("page")) searchParams.set("page", 1);
    setSearchPatams(searchParams);
  }

  return (
    <div className="border border-gray-100 bg-white rounded-sm shadow-sm p-1 flex gap-1">
      {options.map((option) => (
        <button
          onClick={() => handleClick(option.value)}
          className={buttonStyle}
          key={option.label}
          disabled={selectValue === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

Filter.propTypes = {
  filterFiled: PropTypes.any,
  options: PropTypes.array,
};

export default Filter;
