import supabase from "./supabase";

export async function getPFPTByDeviceId({ deviceId }) {
  const { data, error } = await supabase
    .from("pfpt")
    .select("*")
    .eq("device_id", deviceId);
  if (error) {
    console.error(error);
    throw new Error("PFPT By deviceId can not be loaded");
  }
  return data;
}
