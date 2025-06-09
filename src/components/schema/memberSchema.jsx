import * as yup from "yup";

const memberSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email tidak boleh kosong")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
  penempatan: yup
    .object({
      label: yup.string(),
      value: yup.mixed(),
    })
    .nullable(),
  role: yup
    .object({
      label: yup.string().required(),
      value: yup.number().required(),
    })
    .required("Role wajib dipilih."),
});

export default memberSchema;
