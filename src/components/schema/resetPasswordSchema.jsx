import * as yup from "yup";

const resetPasswordSchema = yup.object().shape({
  token: yup.string().required("Token tidak ada"),
  password: yup
    .string()
    .required("Password tidak boleh kosong")
    .min(8, "Password harus berisi minimal 8 karakter")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
});

export default resetPasswordSchema;
