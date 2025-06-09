import * as yup from "yup";

const eventSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nama event wajib diisi.")
    .min(5, "Nama event minimal terdiri dari 5 karakter.")
    .max(100, "Nama event maksimal terdiri dari 100 karakter."),
  address: yup
    .string()
    .required("Lokasi tujuan penyaluran wajib diisi.")
    .min(10, "Lokasi tujuan penyaluran minimal terdiri dari 10 karakter.")
    .max(255, "Lokasi tujuan penyaluran maksimal terdiri dari 255 karakter."),
  endDate: yup.string().required("Tanggal akhir penerimaan wajib diisi."),
  types: yup.array().min(1, "Barang donasi wajib diisi."),
});

export default eventSchema;
