import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateDevice } from "../../services/apiDevices";

export function useEnergized() {
  const queryClient = useQueryClient();

  const { mutate: Energized, isPending: isEnergizing } = useMutation({
    mutationFn: ({ deviceId, deviceObject }) =>
      updateDevice(deviceId, {
        ...deviceObject,
        energized: true,
        actual_finish_time_energized: new Date(),
      }),

    onSuccess: (data) => {
      toast.success(`Device #${data.name} successfully Energized`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error("There was an error while Energizing"),
  });

  return { Energized, isEnergizing };
}
