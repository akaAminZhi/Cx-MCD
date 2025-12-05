import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { PAGE_SIZE } from "../utils/constans";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router";

function Pagination({ count }) {
  const stylePagination = "w-full flex items-center justify-between m-2";
  const styleP = "text-2xl ml-2 ";
  const buttonStyle = `flex gap-1 rounded-sm font-medium text-2xl items-center 
                        justify-center py-1 px-2 transition-all duration-300 disabled:cursor-not-allowed
                        last:pl-4 first:pr-4 hover:bg-indigo-600 hover:text-indigo-50`;

  const [searchParams, setSearchParams] = useSearchParams();
  const curentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = curentPage === pageCount ? curentPage : curentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }
  function prePage() {
    const prev = curentPage === 1 ? curentPage : curentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  return (
    <div className={stylePagination}>
      <p className={styleP}>
        Showing{" "}
        <span className="font-semibold">
          {(curentPage - 1) * PAGE_SIZE + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold">
          {curentPage === pageCount ? count : curentPage * PAGE_SIZE}
        </span>{" "}
        of <span className="font-semibold">{count}</span> result
      </p>
      <div className="flex gap-1 ">
        <button
          className={buttonStyle}
          onClick={prePage}
          disabled={curentPage === 1}
        >
          <HiChevronLeft></HiChevronLeft>
          <span>Previous</span>
        </button>
        <button
          className={buttonStyle}
          onClick={nextPage}
          disabled={curentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight></HiChevronRight>
        </button>
      </div>
    </div>
  );
}
Pagination.propTypes = {
  count: PropTypes.number,
};
export default Pagination;
