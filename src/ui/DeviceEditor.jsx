import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * 设备编辑表单
 * props:
 *  - device: 当前选中的设备对象（包含 id, text/name, rect_px, comments, energized, energized_today, will_energized_at 等）
 *  - projectId: 项目标识
 *  - closeModal: Modal.Window 通过 cloneElement 注入的关闭函数
 */
export default function DeviceEditor({ device, projectId, closeModal }) {
  const [comments, setComments] = useState(device?.comments ?? "");
  const [energized, setEnergized] = useState(!!device?.energized);
  const [energizedToday, setEnergizedToday] = useState(
    !!device?.energized_today
  );
  const [willAt, setWillAt] = useState(
    device?.will_energized_at ? new Date(device.will_energized_at) : null
  );

  // 当切换不同的 device 时，同步表单初值
  useEffect(() => {
    setComments(device?.comments ?? "");
    setEnergized(!!device?.energized);
    setEnergizedToday(!!device?.energized_today);
    setWillAt(
      device?.will_energized_at ? new Date(device.will_energized_at) : null
    );
  }, [device]);

  const qc = useQueryClient();

  // ⚠️ 请按你的后端路由调整：这里假设 PUT /api/v1/devices/:id
  const mutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const url = `/api/v1/devices/${id}`;
      const res = await axios.put(url, payload);
      return res.data;
    },
    onSuccess: () => {
      // 刷新设备列表 & 搜索缓存
      qc.invalidateQueries({ queryKey: ["devices", projectId] });
      qc.invalidateQueries({ queryKey: ["device-search"] });
      closeModal?.();
    },
  });

  if (!device)
    return <div className="p-4 text-base text-gray-500">Loading device…</div>;

  return (
    <div className="w-[min(90vw,80rem)] max-h-[85vh] overflow-hidden space-y-6 p-6 text-2xl">
      <h3 className="text-2xl font-semibold">Device detail</h3>

      <div className="grid grid-cols-[20rem_1fr] gap-y-4 gap-x-8">
        <div className="text-gray-600">Name</div>
        <div className="font-medium break-words">
          {device.text || device.name}
        </div>

        <div className="text-gray-600">ID</div>
        <div>{device.id ?? "-"}</div>

        <div className="text-gray-600">Will be Energized At</div>
        <div>
          <DatePicker
            selected={willAt}
            onChange={(d) => setWillAt(d)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            isClearable
            popperPlacement="bottom-start"
            className="border rounded px-4 py-3 w-full bg-white cursor-pointer text-2xl"
          />
          {/* 若需显示只读文本而点击再弹出，可包一层 Button/Div 去控制 DatePicker 的 open/close */}
        </div>

        <div className="text-gray-600">Energized Today</div>
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            checked={energized ? false : energizedToday}
            onChange={(e) => setEnergizedToday(e.target.checked)}
            className="scale-125"
            aria-label="Energized Today"
          />
          <span className="text-lg">
            {energized
              ? "Alredy Energized"
              : energizedToday
                ? "Energized Today"
                : "Not Energized Today"}
          </span>
        </label>

        <div className="text-gray-600">Energized</div>
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            checked={energized}
            onChange={(e) => setEnergized(e.target.checked)}
            className="scale-125"
            aria-label="Energized"
          />
          <span className="text-lg">
            {energized ? "Energized" : "De-energized"}
          </span>
        </label>

        <div className="text-gray-600">Comments</div>
        <textarea
          className="border rounded px-3 py-2 h-40 text-base w-full resize-none"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add comments…"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={closeModal} variant="secondary">
          Cancel
        </Button>
        <Button
          onClick={() =>
            mutation.mutate({
              id: device.id,
              project: projectId,
              payload: {
                comments,
                energized,
                energized_today: energized ? false : energizedToday,
                will_energized_at: willAt
                  ? new Date(willAt).toISOString()
                  : null,
              },
            })
          }
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

DeviceEditor.propTypes = {
  device: PropTypes.object,
  projectId: PropTypes.string,
  closeModal: PropTypes.func,
};
