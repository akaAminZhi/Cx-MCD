import { useState } from "react";
import PropTypes from "prop-types";
import { HiOutlineXCircle } from "react-icons/hi2";

function SearchInputRoom({ searchText, handleSearch, handleResetSearch }) {
  const [isFocused, setIsFocused] = useState(false);

  const isExpanded = isFocused || searchText.length > 0;

  return (
    <div className="relative inline-block">
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          border px-4 py-1 pr-10 rounded-3xl transition-all duration-300 ease-in-out
          ${isExpanded ? "w-128" : "w-64"}
        `}
      />
      {searchText && (
        <HiOutlineXCircle
          onClick={handleResetSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-4xl cursor-pointer"
        />
      )}
    </div>
  );
}

SearchInputRoom.propTypes = {
  searchText: PropTypes.string,
  handleSearch: PropTypes.func,
  handleResetSearch: PropTypes.func,
};

export default SearchInputRoom;
