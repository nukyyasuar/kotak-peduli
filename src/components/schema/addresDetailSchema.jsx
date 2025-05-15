import * as yup from "yup";

const addressDetailSchema = yup.object({
  alamat: yup.object({
    jalan: yup.string().required("Jalan wajib diisi."),
    latitude: yup.string().required("Latitude wajib."),
    longitude: yup.string().required("Longitude wajib."),
    patokan: yup.string(),
    summary: yup.string(),
  }),
});

export default addressDetailSchema;
