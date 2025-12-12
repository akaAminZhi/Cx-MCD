// api/useDownloadDeviceFile.js
import axios from "axios";

export async function useDownloadDeviceFile(fileId, fileName) {
  const res = await axios.get(`/api/v1/files/${fileId}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  window.URL.revokeObjectURL(url);
}
