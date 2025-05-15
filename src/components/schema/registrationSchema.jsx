import * as yup from "yup";

export const registrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Nama depan tidak boleh kosong")
    .min(3, "Nama depan harus berisi minimal 3 karakter")
    .matches(/^[A-Za-z\s]+$/, "Nama depan hanya boleh berisi huruf dan spasi"),
  lastName: yup
    .string()
    .required("Nama belakang tidak boleh kosong")
    .min(3, "Nama belakang harus berisi minimal 3 karakter")
    .matches(
      /^[A-Za-z\s]+$/,
      "Nama belakang hanya boleh berisi huruf dan spasi"
    ),
  phoneNumber: yup
    .string()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(11, "Nomor telepon minimal terdiri dari 11 digit.")
    .max(15, "Nomor telepon maksimal terdiri dari 15 digit.")
    .matches(
      /^8\d{9,14}$/,
      "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)"
    ),
  email: yup
    .string()
    .required("Email tidak boleh kosong")
    .email(
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
  password: yup
    .string()
    .required("Password tidak boleh kosong")
    .min(8, "Password harus berisi minimal 8 karakter")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email tidak boleh kosong")
    .email(
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
  password: yup
    .string()
    .required("Password tidak boleh kosong")
    .min(8, "Password harus berisi minimal 8 karakter")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
});
