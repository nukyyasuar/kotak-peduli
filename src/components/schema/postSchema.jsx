import * as yup from "yup";

const postSchema = yup.object().shape({
  nama: yup
    .string()
    .required("Nama cabang / drop point wajib diisi.")
    .min(5, "Nama cabang / drop point minimal terdiri dari 5 karakter.")
    .max(100, "Nama cabang / drop point maksimal terdiri dari 100 karakter."),
  nomorTelepon: yup
    .string()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(9, "Nomor telepon minimal terdiri dari 9 digit.")
    .max(15, "Nomor telepon maksimal terdiri dari 15 digit.")
    .matches(
      /^8\d{8,14}$/,
      "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)"
    ),
  alamat: yup
    .object()
    .test("not-empty", "Alamat lengkap wajib diisi.", (value) => {
      return value && value.jalan && value.latitude && value.longitude;
    }),
  tipe: yup.string().required("Tipe tempat wajib diisi."),
});

export default postSchema;
