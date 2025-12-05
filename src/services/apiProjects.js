import supabase from "./supabase";
export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error(error);
    throw new Error("projects can not be loaded");
  }
  return data;
}
