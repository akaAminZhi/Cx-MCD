import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Papa from "papaparse";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import { useUpsertDevices } from "./useUpsertDevices";

function UploadDevicesForm({ closeModal }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();

  const { UpsertDevices, isUpserting } = useUpsertDevices();
  function handleOnsubmit(data) {
    const file = data.csv_file[0];
    // console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        // Parse CSV data
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const originalData = results.data.filter((row) =>
              Object.values(row).some((val) => val !== "")
            );
            const cleanData = originalData.map((item) => ({
              ...item,
              estimated_time_of_enegized:
                item.estimated_time_of_enegized || null,
              actual_finish_time_energized:
                item.actual_finish_time_energized || null,
              actual_finish_time_PFPT: item.actual_finish_time_PFPT || null,
              estimated_time_of_PFPT: item.estimated_time_of_PFPT || null,
            }));
            UpsertDevices(cleanData);
            // console.log(results.data);
            // Handle the parsed data as needed
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      };
      reader.readAsText(file);
    }
  }
  const { errors } = formState;
  function onError(error) {
    // console.log(errors.csv_file.message);
  }
  return (
    <Form
      onSubmit={handleSubmit(handleOnsubmit, onError)}
      type={closeModal ? "modal" : ""}
    >
      <FormRow label="Upload csv file" error={errors?.csv_file?.message}>
        <input
          {...register("csv_file", {
            required: "This filed required",
          })}
          id="csv_file"
          type="file"
          accept=".csv"
          className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-100 file:text-violet-700
              hover:file:bg-violet-200
            "
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}

        <Button
          variation="secondary"
          type="reset"
          onClick={() => closeModal?.()}
        >
          Cancel
        </Button>

        <Button disabled={isUpserting}>{"Upload"}</Button>
      </FormRow>
    </Form>
  );
}
UploadDevicesForm.propTypes = {
  closeModal: PropTypes.any,
};
export default UploadDevicesForm;
