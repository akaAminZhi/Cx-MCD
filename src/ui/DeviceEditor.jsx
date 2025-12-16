import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiDocumentArrowDown,
  HiEye,
} from "react-icons/hi2";

// hooks
import { useDeviceFiles } from "../hooks/useDeviceFiles";
import { useUploadDeviceFile } from "../hooks/useUploadDeviceFile";

export default function DeviceEditor({ device, projectId, closeModal }) {
  // ======================================================
  // STATE
  // ======================================================
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [fileType, setFileType] = useState("panel_schedule");

  // when device changes
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

  // ======================================================
  // MUTATION: update device
  // ======================================================
  const mutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(`/api/v1/devices/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projectEquipments", projectId] });
      qc.invalidateQueries({ queryKey: ["devices", projectId] });
      qc.invalidateQueries({ queryKey: ["deviceFiles"] });
      closeModal?.();
    },
  });

  // ======================================================
  // FILE LIST + FILE UPLOAD
  // ======================================================
  const {
    data: filesData,
    isLoading: filesLoading,
    isError: filesError,
  } = useDeviceFiles(device.id);

  const files = filesData?.data ?? [];

  const uploadMutation = useUploadDeviceFile();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
    e.target.value = ""; // reset input
  };

  const handleClickUpload = () => {
    if (!selectedFile) return;

    setUploadingFile(selectedFile);
    uploadMutation.mutate({
      deviceId: device.id,
      file: selectedFile,
      fileType,
    });
    setSelectedFile(null);
  };

  const handleDownload = async (file) => {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed.");
    }
  };

  const handlePreview = async (file) => {
    try {
      const res = await axios.get(`/api/v1/files/${file.id}`, {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(res.data);
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      alert("Preview failed.");
    }
  };

  if (!device)
    return <div className="text-xl text-gray-500 p-4">Loading device…</div>;

  // ======================================================
  // UI START
  // ======================================================
  return (
    <div className="w-[min(92vw,78rem)] max-h-[88vh] overflow-hidden space-y-10 p-8 text-xl leading-relaxed">
      {/* ======================================================
         HEADER
      ====================================================== */}
      <h3 className="text-3xl font-bold tracking-tight text-slate-900">
        Device Details
      </h3>

      {/* ======================================================
         DEVICE INFO GRID
      ====================================================== */}
      <div className="grid grid-cols-[18rem_1fr] gap-y-6 gap-x-10 text-xl">
        {/* ================= Name ================= */}
        <div className="text-slate-500 font-medium pt-1">Name</div>
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <input
              className="border rounded-lg px-4 py-3 text-2xl w-full focus:outline-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          ) : (
            <span className="text-2xl font-semibold text-slate-900">
              {name || device.text || "-"}
            </span>
          )}

          <button
            type="button"
            className="p-2 rounded hover:bg-slate-100"
            onClick={() => setIsEditingName(!isEditingName)}
          >
            {isEditingName ? (
              <HiOutlineCheck className="w-8 h-8 text-green-600" />
            ) : (
              <HiOutlinePencilSquare className="w-8 h-8 text-slate-700" />
            )}
          </button>
        </div>

        {/* ================= ID ================= */}
        <div className="text-slate-500 font-medium pt-1">ID</div>
        <div className="font-medium">{device.id}</div>

        {/* ================= Energized At ================= */}
        <div className="text-slate-500 font-medium pt-1">
          Will be energized at
        </div>
        <div>
          <DatePicker
            selected={willAt}
            onChange={(d) => setWillAt(d)}
            dateFormat="yyyy-MM-dd"
            isClearable
            className="border rounded-lg px-4 py-3 w-full bg-white cursor-pointer text-xl focus:outline-indigo-500"
            placeholderText="Select a date…"
          />
        </div>

        {/* ================= Energized Today ================= */}
        <div className="text-slate-500 font-medium pt-1">Energized Today</div>
        <label className="inline-flex items-center gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={energized ? false : energizedToday}
            onChange={(e) => setEnergizedToday(e.target.checked)}
            className="scale-150"
          />
          <span className="text-xl">
            {energized
              ? "Already Energized"
              : energizedToday
                ? "Energized Today"
                : "Not Energized Today"}
          </span>
        </label>

        {/* ================= Energized ================= */}
        <div className="text-slate-500 font-medium pt-1">Energized</div>
        <label className="inline-flex items-center gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={energized}
            onChange={(e) => setEnergized(e.target.checked)}
            className="scale-150"
          />
          <span className="text-xl">
            {energized ? "Energized" : "De-energized"}
          </span>
        </label>

        {/* ================= Comments ================= */}
        <div className="text-slate-500 font-medium pt-1">Comments</div>
        <textarea
          className="border rounded-lg px-4 py-3 h-48 text-xl w-full resize-none focus:outline-indigo-500"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add comments…"
        />

        {/* ======================================================
           FILES SECTION
        ====================================================== */}
        <div className="text-slate-500 font-medium pt-1">Files</div>

        <div className="space-y-6">
          {/* Upload Controls */}
          <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* File Type */}
              <div>
                <label className="block text-slate-600 text-lg mb-1">
                  File type
                </label>
                <select
                  className="border rounded-lg px-3 py-2 text-lg bg-white focus:outline-indigo-500"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="panel_schedule">Panel schedule</option>
                  <option value="test_report">Test report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Choose file */}
              <div className="flex items-center gap-4">
                <input
                  id="device-file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="device-file-input"
                  className="px-4 py-2 border rounded-lg bg-white text-lg cursor-pointer hover:bg-slate-100"
                >
                  Choose file
                </label>

                <Button
                  onClick={handleClickUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Uploading…" : "Upload"}
                </Button>
              </div>
            </div>

            {/* Selected file text */}
            <div className="text-slate-600 text-base">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : uploadingFile
                  ? `Last uploaded: ${uploadingFile.name}`
                  : "No file selected"}
            </div>
          </div>

          {/* File list */}
          {filesLoading && (
            <div className="text-slate-500 text-base">Loading files…</div>
          )}

          {filesError && (
            <div className="text-red-500 text-base">Failed to load files.</div>
          )}

          {!filesLoading && files.length === 0 && (
            <div className="text-slate-500 text-base">
              No files uploaded for this device.
            </div>
          )}

          {files.length > 0 && (
            <div className="border rounded-xl bg-white max-h-72 overflow-auto divide-y">
              {files.map((file) => {
                const isPreviewable =
                  file.mime_type?.startsWith("image/") ||
                  file.mime_type === "application/pdf";

                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xl truncate">
                        {file.file_name}
                      </div>
                      <div className="text-lg text-slate-500">
                        {file.file_type} · {(file.file_size / 1024).toFixed(1)}{" "}
                        KB · {new Date(file.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isPreviewable && (
                        <button
                          onClick={() => handlePreview(file)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                        >
                          <HiEye className="w-6 h-6 text-slate-700" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                      >
                        <HiDocumentArrowDown className="w-6 h-6 text-slate-700" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
         ACTION BAR
      ====================================================== */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>

        <Button
          onClick={() =>
            mutation.mutate({
              id: device.id,
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
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

DeviceEditor.propTypes = {
  device: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
