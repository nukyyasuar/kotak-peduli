import * as yup from "yup";

const profileSchema = yup.object().shape({
  namaDepan: yup
    .string()
    .required("Nama depan wajib diisi.")
    .min(3, "Nama depan minimal terdiri dari 3 karakter.")
    .max(50, "Nama depan maksimal terdiri dari 50 karakter.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Nama depan hanya boleh menggunakan huruf dan spasi."
    ),
  namaBelakang: yup
    .string()
    .required("Nama belakang wajib diisi.")
    .min(3, "Nama belakang minimal terdiri dari 3 karakter.")
    .max(50, "Nama belakang maksimal terdiri dari 50 karakter.")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Nama belakang hanya boleh menggunakan huruf dan spasi."
    ),
  nomorTelepon: yup
    .string()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(9, "Nomor telepon minimal terdiri dari 9 digit.")
    .max(15, "Nomor telepon maksimal terdiri dari 15 digit.")
    .matches(
      /^8\d{9,14}$/,
      "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)"
    ),
  email: yup
    .string()
    .required("Email wajib diisi.")
    .email("Format email tidak valid."),
  alamat: yup.string().required("Alamat lengkap wajib diisi."),
  jalan: yup.string().required("Nama jalan wajib diisi."),
  patokan: yup.string().required("Patokan wajib diisi."),
  foto: yup
    .mixed()
    .test("fileSize", "Ukuran file terlalu besar. Maksimal 5MB.", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    })
    .test(
      "fileType",
      "Format file tidak didukung. Hanya JPG, JPEG, PNG yang diperbolehkan.",
      (value) => {
        return (
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
        );
      }
    ),
});

export default profileSchema;
