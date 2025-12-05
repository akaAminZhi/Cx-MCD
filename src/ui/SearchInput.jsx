import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HiMagnifyingGlassCircle, HiOutlineXCircle } from "react-icons/hi2";
import { useSearchDevices } from "../features/devices/useSearchDevices";
import { createPortal } from "react-dom";
import { useParams, useSearchParams } from "react-router";

function useRect(node) {
  const [rect, setRect] = useState(null);
  useLayoutEffect(() => {
    if (!node) return;
    const update = () => setRect(node.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [node]);
  return rect;
}
export default function SearchInput() {
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const rect = useRect(inputRef.current);
  const [searchParams, setSearchParams] = useSearchParams();
  const { projectId } = useParams();
  /* 1️⃣ – initialise from the URL */
  const [input, setInput] = useState(() => searchParams.get("search") || "");
  const { results, isFetching, error } = useSearchDevices(input, projectId);

  /* 2️⃣ – keep local state and URL in sync both ways */
  useEffect(() => {
    const urlValue = searchParams.get("search") || "";
    if (urlValue !== input) setInput(urlValue);
  }, [searchParams]); // runs when navigation happens elsewhere

  /* cleanup only when BOTH are empty */
  useEffect(() => {
    if (input === "" && searchParams.get("search") !== null) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("search");
          return next;
        },
        { replace: true }
      );
    }
  }, [input, searchParams, setSearchParams]);

  const handleChange = (e) => {
    setInput(e.target.value);
    setShowResults(true); // show the list while the user is typing
  };

  const handleClean = () => {
    setInput("");
  };
  const handleClick = (item) => {
    // put the chosen value in the URL
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("search", item.name);
        return next;
      },
      { replace: true }
    ); // 1 history entry only
    setInput(item.name); // triggers the cleanup above
    setShowResults(false);
  };
  const resultList = (
    <AnimatePresence>
      {showResults && input && rect && (
        <motion.ul
          key="results"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: rect.bottom + 4, // 4px gap below input
            left: rect.left,
            width: rect.width,
            zIndex: 9999, // very top layer
          }}
          className="bg-white rounded-2xl shadow-lg divide-y divide-gray-100 overflow-hidden"
        >
          {error && <li className="px-4 py-3 text-red-500">{error.message}</li>}
          {!error && results.length === 0 && !isFetching && (
            <li className="px-4 py-3 text-gray-500">No results</li>
          )}
          {results.map((item) => (
            <li
              key={item.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleClick(item)}
            >
              {item.name}
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search box */}
      <div className="relative">
        <HiMagnifyingGlassCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-4xl" />
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={(e) => handleChange(e)}
          placeholder="Search…"
          className="w-full pl-12 pr-4 py-2 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
        />
        {input && (
          <HiOutlineXCircle
            onClick={handleClean}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-4xl"
          />
        )}
        {isFetching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582M4 9.582A7.5 7.5 0 1110.418 4H16"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Results */}
      {createPortal(resultList, document.body)}
    </div>
  );
}
