import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateDevice } from "../../services/apiDevices";

export function usePFPTDone() {
  const queryClient = useQueryClient();

  const { mutate: PFPTDone, isPending: isPFPTing } = useMutation({
    mutationFn: ({ deviceId, deviceObject }) =>
      updateDevice(deviceId, {
        ...deviceObject,
        PFPT: true,
        actual_finish_time_PFPT: new Date(),
      }),

    onSuccess: (data) => {
      toast.success(`Device ${data.name} successfully set PFPT Done`);
      queryClient.invalidateQueries({ active: true });

      // queryClient.invalidateQueries({
      //   queryKey: ["devicesByProjectIdAndPage", "devicesByProjectId"],
      //   exact: false,
      // });
    },

    onError: () => toast.error("There was an error while PFPTing"),
  });

  return { PFPTDone, isPFPTing };
}
