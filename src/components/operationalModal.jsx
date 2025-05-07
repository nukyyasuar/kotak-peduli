import { useFieldArray, useForm } from "react-hook-form";
import { ButtonCustom } from "src/components/button";
import { FormInput } from "./formInput";
import { Icon } from "@iconify/react";

const days = [
  { label: "Senin", value: "senin" },
  { label: "Selasa", value: "selasa" },
  { label: "Rabu", value: "rabu" },
  { label: "Kamis", value: "kamis" },
  { label: "Jumat", value: "jumat" },
  { label: "Sabtu", value: "sabtu" },
  { label: "Minggu", value: "minggu" },
];

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: i.toString().padStart(2, "0"),
  value: i.toString().padStart(2, "0"),
}));

const minutes = Array.from({ length: 60 }, (_, i) => ({
  label: i.toString().padStart(2, "0"),
  value: i.toString().padStart(2, "0"),
}));

export default function OperationalModal({ isOpen, handleClose, setValue }) {
  const { control, getValues } = useForm({
    defaultValues: {
      waktuOperasional: [
        {
          day: "",
          openHour: "",
          openMinute: "",
          closeHour: "",
          closeMinute: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "waktuOperasional",
  });
  const handleSave = () => {
    setValue("waktuOperasional", getValues("waktuOperasional"));
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-20">
      <div className="bg-white rounded-lg flex flex-col p-8 text-black gap-6">
        <h3 className="text-xl font-bold">Waktu Operasional</h3>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <FormInput
                inputType="dropdownInput"
                options={days}
                control={control}
                name={`waktuOperasional.${index}.day`}
                placeholder={"Senin"}
                inputStyles="w-32"
              />
              <div className="flex gap-1 items-center">
                <FormInput
                  inputType="dropdownInput"
                  options={hours}
                  control={control}
                  name={`waktuOperasional.${index}.openHour`}
                  placeholder={"08"}
                  inputStyles="w-25"
                />
                <span>:</span>
                <FormInput
                  inputType="dropdownInput"
                  options={minutes}
                  control={control}
                  name={`waktuOperasional.${index}.openMinute`}
                  placeholder={"00"}
                  inputStyles="w-25"
                />
              </div>
              <div className="flex gap-1 items-center">
                <FormInput
                  inputType="dropdownInput"
                  options={hours}
                  control={control}
                  name={`waktuOperasional.${index}.closeHour`}
                  placeholder={"17"}
                  inputStyles="w-25"
                />
                <span>:</span>
                <FormInput
                  inputType="dropdownInput"
                  options={minutes}
                  control={control}
                  name={`waktuOperasional.${index}.closeMinute`}
                  placeholder={"00"}
                  inputStyles="w-25"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      day: "senin",
                      openHour: "08",
                      openMinute: "00",
                      closeHour: "17",
                      closeMinute: "00",
                    })
                  }
                  className="bg-[#F0BB78] text-white rounded-lg text-sm text-nowrap h-12 px-5"
                >
                  + Add
                </button>
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-[#E52020] text-white rounded-lg text-sm text-nowrap h-12 px-5"
                >
                  <Icon icon="mdi:trash" width={20} color="white" />
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-3 mt-4">
          <ButtonCustom
            label="Simpan"
            variant="brown"
            type="button"
            onClick={handleSave}
            className="w-full"
          />
          <ButtonCustom
            label="Batal"
            onClick={handleClose}
            variant="white"
            type="button"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
