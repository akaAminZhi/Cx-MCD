import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constans";
import { addDays, endOfISOWeek, startOfISOWeek, subDays } from "date-fns";
import { getStartOfThisWeek } from "../utils/helpers";
import { endOfDay, startOfDay } from "date-fns";

export async function getDevices() {
  const { data, error } = await supabase.from("devices").select("*");
  if (error) {
    console.error(error);
    throw new Error("Deviced can not be loaded");
  }
  return data;
}

export async function getDevicesBySearch(query, project_id) {
  if (!query) return [];
  const { data, error } = await supabase
    .from("devices") // ← change to your table / view
    .select("id, name")
    .eq("project_id", project_id)
    .ilike("name", `%${query}%`) // case‑insensitive LIKE
    .limit(10);

  if (error) throw error;
  return data;
}

export async function getDevicesByProjectIdAndPage({
  ProjectId,
  page,
  filter,
  searchValue,
}) {
  let query = supabase
    .from("devices")
    .select("*", { count: "exact" })
    .eq("project_id", ProjectId)
    .order("id", { ascending: false });
  // const queryDate = addDays(new Date(), 10).toISOString();
  // console.log(queryDate);
  // console.log(getStartOfThisWeek());
  // console.log(endOfISOWeek(new Date()));
  // FILTER
  // console.log(searchValue);
  if (filter) {
    if (filter.value === "energized")
      query = query[filter.method || "eq"]("energized", true);
    if (filter.value === "PFPT")
      query = query[filter.method || "eq"]("PFPT", true);
    if (filter.value === "not_energized")
      query = query[filter.method || "eq"]("energized", false);
    if (filter.value === "task_this_week") {
      const today = new Date();
      const start = startOfISOWeek(today).toISOString();
      const end = endOfISOWeek(today).toISOString();
      query = query.or(
        `and(estimated_time_of_enegized.gte.${start},estimated_time_of_enegized.lte.${end}),and(estimated_time_of_PFPT.gte.${start},estimated_time_of_PFPT.lte.${end})`
      );

      // query = query
      //   .gte("estimated_time_of_enegized", start)
      //   .lte("estimated_time_of_enegized", end);
    }
  }

  if (searchValue) {
    // Case-insensitive “contains” on **multiple columns** for convenience
    query = query.or(`name.ilike.%${searchValue}%`);
  }
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }
  // if (searchValue) {
  //   query = query.eq("name", searchValue);
  // }
  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("Device By projectId can not be loaded");
  }
  return { data, count };
}

export async function updateDevice(id, obj) {
  const { data, error } = await supabase
    .from("devices")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Device could not be updated");
  }
  return data;
}

export async function getAllDevicesByProjectId({ ProjectId }) {
  let query = supabase
    .from("devices")
    .select("*", { count: "exact" })
    .eq("project_id", ProjectId);

  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("Device By projectId can not be loaded");
  }
  return { data, count };
}

export async function upsertDevices(cleanData) {
  // console.log(cleanData);
  const { data, error } = await supabase.from("devices").upsert(cleanData, {
    onConflict: "id", // change this to your primary key
    ignoreDuplicates: false,
  });

  if (error) {
    console.error(error);
    throw new Error("upsert failed");
  }
  return data;
}

export async function getProjectDeviceStats() {
  const { data, error } = await supabase
    .from("project_device_stats")
    .select("*");
  if (error) {
    console.error(error);
    throw new Error("Device By projectId can not be loaded");
  }
  return data;
}

export async function getTodayTask() {
  const today = new Date();
  const start = startOfDay(today).toISOString();
  const end = endOfDay(today).toISOString();
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .or(
      `and(energized.eq.false,estimated_time_of_enegized.gte.${start},estimated_time_of_enegized.lte.${end}),and(PFPT.eq.false,estimated_time_of_PFPT.gte.${start},estimated_time_of_PFPT.lte.${end})`
    );
  if (error) {
    console.error(error);
    throw new Error("Device getTodayTask error");
  }
  return data;
}
