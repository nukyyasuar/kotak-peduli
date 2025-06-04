import * as yup from "yup";

export const registrationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Nama depan wajib diisi.")
    .min(3, "Nama depan minimal terdiri dari 3 karakter.")
    .max(50, "Nama depan maksimal terdiri dari 50 karakter.")
    .matches(
      /^[A-Za-z\s]+$/,
      "Nama depan hanya boleh menggunakan huruf dan spasi."
    ),
  lastName: yup
    .string()
    .required("Nama belakang wajib diisi.")
    .min(3, "Nama belakang minimal terdiri dari 3 karakter.")
    .max(50, "Nama belakang maksimal terdiri dari 50 karakter.")
    .matches(
      /^[A-Za-z\s]+$/,
      "Nama belakang hanya boleh menggunakan huruf dan spasi."
    ),
  phoneNumber: yup
    .string()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(9, "Nomor telepon minimal terdiri dari 9 digit.")
    .max(15, "Nomor telepon maksimal terdiri dari 15 digit.")
    .matches(
      /^8\d{9,14}$/,
      "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)."
    ),
  email: yup
    .string()
    .required("Email wajib diisi.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
  password: yup
    .string()
    .required("Password wajib diisi.")
    .min(8, "Password minimal terdiri dari 8 karakter.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus terdiri dari huruf besar, huruf kecil, dan angka."
    ),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email wajib diisi.")
    .email(
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)."
    ),
  password: yup
    .string()
    .required("Password wajib diisi.")
    .min(8, "Password minimal terdiri dari 8 karakter.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus terdiri dari huruf besar, huruf kecil, dan angka."
    ),
});
