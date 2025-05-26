import * as yup from "yup";

const forgotPassSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email tidak boleh kosong")
    .email(
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
});

export default forgotPassSchema;
