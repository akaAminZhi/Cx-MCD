// src/features/devices/DeviceSearchBox.jsx
import { useState, useRef } from "react";
import useSearchDevices from "../hooks/useSearchDevices";
import { HiXMark } from "react-icons/hi2";

export default function DeviceSearchBox({
  project,
  filePage,
  onPick,
  placeholder = "Search device...",
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const { data, isFetching, isError, error } = useSearchDevices({
    q,
    page: 1,
    size: 20,
    project,
    file_page: filePage,
  });
  const wrapRef = useRef(null);

  const items =
    (Array.isArray(data?.data) && data.data) ||
    (Array.isArray(data?.items) && data.items) ||
    (Array.isArray(data) && data) ||
    [];

  const handleChange = (e) => {
    setQ(e.target.value);
    setOpen(true);
  };

  const handlePick = (it) => {
    const display = it.text || it.name || "";
    setQ(display);
    setOpen(false);
    onPick?.(it);
  };

  const handleClear = () => {
    setQ("");
    setOpen(false);
  };

  const showDropdown =
    open && (isFetching || isError || items.length > 0) && q.trim().length > 0;

  return (
    <div ref={wrapRef} style={{ position: "relative", width: 320 }}>
      <div className="relative">
        <input
          value={q}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border rounded px-3 py-2 pr-8"
          onFocus={() => setOpen(true)}
        />
        {q && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="clear"
          >
            <HiXMark size={18} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow overflow-hidden">
          {isFetching && (
            <div className="px-3 py-2 text-xs text-gray-500">loading…</div>
          )}
          {!isFetching && isError && (
            <div className="px-3 py-2 text-xs text-red-600">
              search failed:{String(error?.message || "unknown")}
            </div>
          )}
          {!isFetching && !isError && items.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500">
              no result matched
            </div>
          )}
          {!isFetching &&
            !isError &&
            items.length > 0 &&
            items.map((it, idx) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handlePick(it)}
              >
                <div className="font-medium">{it.text || it.name}</div>
                <div className="text-xs text-gray-500">
                  {it.file_page === 1
                    ? "Normal"
                    : it.file_page === 2
                      ? "Emergency"
                      : "-"}{" "}
                  · {it.type ?? "device"}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
