import { useFieldArray, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { ButtonCustom } from "src/components/button";
import { FormInput } from "./formInput";
import operationalTimeSchema from "./schema/operationalTimeSchema";
import { days } from "./options";

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: i.toString().padStart(2, "0"),
  value: i.toString().padStart(2, "0"),
}));

const minutes = Array.from({ length: 60 }, (_, i) => ({
  label: i.toString().padStart(2, "0"),
  value: i.toString().padStart(2, "0"),
}));

export default function OperationalModal({ isOpen, handleClose, setValue }) {
  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
    clearErrors,
    watch,
  } = useForm({
    resolver: yupResolver(operationalTimeSchema),
    mode: "onBlur",
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
    watch("waktuOperasional").forEach((item) => {
      clearErrors(item.day);
      clearErrors(item.openHour);
      clearErrors(item.openMinute);
      clearErrors(item.closeHour);
      clearErrors(item.closeMinute);
    });
    handleClose();
  };

  console.log("errors modal operasional", errors);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-20">
      <div className="bg-white rounded-lg flex flex-col p-8 text-black gap-3">
        <h3 className="text-xl font-bold mb-3">
          Waktu Operasional (Hari, Waktu Buka & Tutup)
        </h3>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <FormInput
                  inputType="dropdownInput"
                  options={days}
                  control={control}
                  name={`waktuOperasional.${index}.day`}
                  placeholder={"Senin"}
                  inputStyles="w-32"
                  required
                />
                <div className="flex gap-1 items-center">
                  <FormInput
                    inputType="dropdownInput"
                    options={hours}
                    control={control}
                    name={`waktuOperasional.${index}.openHour`}
                    placeholder={"08"}
                    inputStyles="w-25"
                    required
                  />
                  <span>:</span>
                  <FormInput
                    inputType="dropdownInput"
                    options={minutes}
                    control={control}
                    name={`waktuOperasional.${index}.openMinute`}
                    placeholder={"00"}
                    inputStyles="w-25"
                    required
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
                    required
                  />
                  <span>:</span>
                  <FormInput
                    inputType="dropdownInput"
                    options={minutes}
                    control={control}
                    name={`waktuOperasional.${index}.closeMinute`}
                    placeholder={"00"}
                    inputStyles="w-25"
                    required
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        day: "",
                        openHour: "",
                        openMinute: "",
                        closeHour: "",
                        closeMinute: "",
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
            {errors?.waktuOperasional?.[index] && (
              <p className="text-[#E52020] text-sm">
                Hari, jam & menit buka, serta jam & menit tutup wajib diisi
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-3 mt-4">
          <ButtonCustom
            label="Simpan"
            variant="brown"
            type="submit"
            onClick={handleSubmit(handleSave)}
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
