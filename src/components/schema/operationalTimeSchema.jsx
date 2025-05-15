import * as yup from "yup";

const operationalTimeSchema = yup.object({
  waktuOperasional: yup
    .array()
    .of(
      yup.object({
        day: yup.string().required("Hari wajib diisi."),
        openHour: yup.string().required("Jam buka wajib diisi."),
        openMinute: yup.string().required("Menit buka wajib diisi."),
        closeHour: yup.string().required("Jam tutup wajib diisi."),
        closeMinute: yup.string().required("Menit tutup wajib diisi."),
      })
    )
    .min(1, "Minimal 1 waktu operasional."),
});

export default operationalTimeSchema;
