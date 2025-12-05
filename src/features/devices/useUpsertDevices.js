import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { upsertDevices } from "../../services/apiDevices";

export function useUpsertDevices() {
  const queryClient = useQueryClient();

  const { mutate: UpsertDevices, isPending: isUpserting } = useMutation({
    mutationFn: upsertDevices,

    onSuccess: () => {
      toast.success(`successfully Upload`);
      queryClient.invalidateQueries(["devices"]);
      //   queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error("There was an error while Upserting"),
  });

  return { UpsertDevices, isUpserting };
}
