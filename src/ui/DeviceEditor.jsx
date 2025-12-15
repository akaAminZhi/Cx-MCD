import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlinePencilSquare, HiOutlineCheck } from "react-icons/hi2";

// ⭐ 已有 hooks
import { useDeviceFiles } from "../hooks/useDeviceFiles";
import { useUploadDeviceFile } from "../hooks/useUploadDeviceFile";

export default function DeviceEditor({ device, projectId, closeModal }) {
  const [name, setName] = useState(device?.text || device?.name || "");
  const [isEditingName, setIsEditingName] = useState(false);

  const [comments, setComments] = useState(device?.comments ?? "");
  const [energized, setEnergized] = useState(!!device?.energized);
  const [energizedToday, setEnergizedToday] = useState(
    !!device?.energized_today
  );
  const [willAt, setWillAt] = useState(
    device?.will_energized_at ? new Date(device.will_energized_at) : null
  );

  // 选择的文件（还没上传）
  const [selectedFile, setSelectedFile] = useState(null);
  // 最近一次上传的文件（用来显示状态）
  const [uploadingFile, setUploadingFile] = useState(null);
  // file_type
  const [fileType, setFileType] = useState("panel_schedule");

  useEffect(() => {
    setName(device?.text || device?.name || "");
    setIsEditingName(false);

    setComments(device?.comments ?? "");
    setEnergized(!!device?.energized);
    setEnergizedToday(!!device?.energized_today);
    setWillAt(
      device?.will_energized_at ? new Date(device.will_energized_at) : null
    );

    setSelectedFile(null);
    setUploadingFile(null);
    setFileType("panel_schedule");
  }, [device]);

  const qc = useQueryClient();

  // ========= 更新设备信息 =========
  const mutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const url = `/api/v1/devices/${id}`;
      const res = await axios.put(url, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projectEquipments", projectId] });
      qc.invalidateQueries({ queryKey: ["devices"] });
      qc.invalidateQueries({ queryKey: ["device-search"] });
      closeModal?.();
    },
  });

  // ========= 文件列表 =========
  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
  } = useDeviceFiles(device?.id);

  const files = filesData?.data || [];

  // ========= 上传文件（点击 Upload 才上传） =========
  const uploadMutation = useUploadDeviceFile();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    // 只选文件，不上传
    e.target.value = "";
  }

  function handleClickUpload() {
    if (!selectedFile || !device?.id) return;

    setUploadingFile(selectedFile);

    uploadMutation.mutate({
      deviceId: device.id,
      file: selectedFile,
      fileType,
    });

    setSelectedFile(null);
  }

  // ========= 下载文件 =========
  async function handleDownload(file) {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name || "file";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed");
    }
  }

  // ========= 预览文件（图片 / PDF） =========
  async function handlePreview(file) {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(res.data);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      // 不要立刻 revoke，留给新窗口使用；可以做个 setTimeout 再回收
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 60 * 1000);
    } catch (err) {
      console.error("Preview failed", err);
      alert("Preview failed");
    }
  }

  if (!device)
    return <div className="p-4 text-base text-gray-500">Loading device…</div>;

  return (
    <div className="w-[min(90vw,80rem)] max-h-[85vh] overflow-hidden space-y-6 p-6 text-2xl">
      <h3 className="text-2xl font-semibold">Device detail</h3>

      <div className="grid grid-cols-[20rem_1fr] gap-y-4 gap-x-8">
        {/* === Name 行 === */}
        <div className="text-gray-600">Name</div>
        <div className="flex items-center gap-2 font-medium break-words">
          {isEditingName ? (
            <input
              className="border rounded px-3 py-2 text-2xl flex-1 min-w-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          ) : (
            <span className="flex-1 min-w-0 truncate">
              {name || device.text || device.name || "-"}
            </span>
          )}

          <button
            type="button"
            className="p-1 rounded hover:bg-gray-200 flex-shrink-0"
            onClick={() => setIsEditingName((prev) => !prev)}
            title={isEditingName ? "Finish editing" : "Edit name"}
          >
            {isEditingName ? (
              <HiOutlineCheck className="w-10 h-10 text-green-600" />
            ) : (
              <HiOutlinePencilSquare className="w-10 h-10" />
            )}
          </button>
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

        {/* ============ Files 区 ============ */}
        <div className="text-gray-600">Files</div>
        <div className="space-y-4 text-base">
          {/* 上传区域：选择文件 + Upload 按钮 */}
          <div className="space-y-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="text-sm text-gray-600 mb-1">File type</div>
                <select
                  className="border rounded px-3 py-2 text-sm bg-white"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="panel_schedule">Panel schedule</option>
                  <option value="test_report">Test report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                {/* 选择文件 */}
                <input
                  id="device-file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="device-file-input"
                  className="inline-flex items-center px-4 py-2 border rounded-md bg-white text-sm font-medium cursor-pointer hover:bg-gray-50"
                >
                  Choose file
                </label>

                {/* 点击上传 */}
                <Button
                  size="small"
                  onClick={handleClickUpload}
                  disabled={
                    !selectedFile || uploadMutation.isPending || !device
                  }
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>

                <span className="text-2xl text-gray-500">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : uploadingFile
                      ? `Last upload: ${uploadingFile.name}`
                      : "No file selected"}
                </span>
              </div>
            </div>
          </div>

          {/* 文件列表 */}
          {filesLoading && (
            <div className="text-sm text-gray-500">Loading files…</div>
          )}
          {filesError && (
            <div className="text-sm text-red-500">Failed to load files.</div>
          )}

          {!filesLoading && files.length === 0 && (
            <div className="text-sm text-gray-500">
              No files uploaded for this device.
            </div>
          )}

          {files.length > 0 && (
            <div className="border rounded-md bg-white max-h-56 overflow-auto divide-y">
              {files.map((file) => {
                const canPreview =
                  file.mime_type &&
                  (file.mime_type.startsWith("image/") ||
                    file.mime_type === "application/pdf");

                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-2xl">
                        {file.file_name}
                      </div>
                      <div className="text-2xl text-gray-500">
                        {file.file_type || "other"} ·{" "}
                        {file.file_size
                          ? `${(file.file_size / 1024).toFixed(1)} KB`
                          : ""}
                        {file.created_at && (
                          <>
                            {" "}
                            · {new Date(file.created_at).toLocaleDateString()}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {canPreview && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => handlePreview(file)}
                        >
                          Preview
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDownload(file)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
                text: name,
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
