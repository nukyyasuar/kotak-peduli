import * as yup from "yup";

const eventSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nama event wajib diisi.")
    .min(10, "Nama event minimal terdiri dari 10 karakter.")
    .max(100, "Nama event maksimal terdiri dari 100 karakter."),
  address: yup.string().required("Alamat lengkap wajib diisi."),
  endDate: yup.string().required("Tanggal akhir event wajib diisi."),
  types: yup.array().min(1, "Barang donasi wajib diisi."),
});

export default eventSchema;
