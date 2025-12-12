// api/useDeleteDeviceFile.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function deleteDeviceFile(fileId) {
  await axios.delete(`/api/v1/files/${fileId}`);
}

export function useDeleteDeviceFile(deviceId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeviceFile,
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceFiles", deviceId]);
    },
  });
}
