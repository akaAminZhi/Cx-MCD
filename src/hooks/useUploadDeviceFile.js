// api/useUploadDeviceFile.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function uploadDeviceFile({ deviceId, file, fileType }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_type", fileType || "other");

  const res = await axios.post(`/api/v1/devices/${deviceId}/files`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export function useUploadDeviceFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDeviceFile,
    onSuccess: (data, variables) => {
      // 刷新文件列表
      queryClient.invalidateQueries(["deviceFiles", variables.deviceId]);
    },
  });
}
