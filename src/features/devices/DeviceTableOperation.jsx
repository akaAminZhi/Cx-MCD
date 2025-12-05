import Filter from "../../ui/Filter";

function DeviceTableOperation() {
  return (
    <div className="flex gap-4 items-center">
      <Filter
        filterFiled="status"
        options={[
          { value: "all", label: "All" },
          { value: "task_this_week", label: "Task This Week" },
          { value: "energized", label: "Energized" },
          { value: "PFPT", label: "PFPT" },
          { value: "not_energized", label: "Not Energized" },
        ]}
      ></Filter>
    </div>
  );
}

export default DeviceTableOperation;
