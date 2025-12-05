import React from "react";
import SearchInputRoom from "./SearchInputRoom"; // 确保路径正确
import PropTypes from "prop-types";

function DiagramSearchBox({
  searchText,
  matchedRooms,
  handleSearch,
  handleResetSearch,
  handleSelect,
}) {
  return (
    <div className="w-64 mb-4 relative z-30">
      <SearchInputRoom
        searchText={searchText}
        handleSearch={handleSearch}
        handleResetSearch={handleResetSearch}
      />
      {matchedRooms.length > 0 && (
        <ul className="absolute top-10 w-full bg-white border shadow z-40 max-h-48 overflow-y-auto text-xl">
          {matchedRooms.map((item) => (
            <li
              key={item.room_plate}
              onClick={() => handleSelect(item)}
              className="px-2 py-1 cursor-pointer hover:bg-blue-100"
            >
              {item.room_plate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
DiagramSearchBox.propTypes = {
  searchText: PropTypes.string,
  matchedRooms: PropTypes.string,
  handleSelect: PropTypes.func,
  handleSearch: PropTypes.func,
  handleResetSearch: PropTypes.func,
};
export default DiagramSearchBox;
