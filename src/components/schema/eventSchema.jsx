import * as yup from "yup";

const eventSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nama event wajib diisi.")
    .min(5, "Nama event minimal terdiri dari 5 karakter.")
    .max(100, "Nama event maksimal terdiri dari 100 karakter."),
  address: yup
    .string()
    .required("Alamat lengkap wajib diisi.")
    .min(10, "Alamat lengkap minimal terdiri dari 10 karakter.")
    .max(255, "Alamat lengkap maksimal terdiri dari 255 karakter."),
  endDate: yup.string().required("Tanggal akhir event wajib diisi."),
  types: yup.array().min(1, "Barang donasi wajib diisi."),
});

export default eventSchema;
