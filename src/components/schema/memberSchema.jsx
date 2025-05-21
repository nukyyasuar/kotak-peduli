import * as yup from "yup";

const memberSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email tidak boleh kosong")
    .email(
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
  penempatan: yup
    .object({
      label: yup.string().required(),
      value: yup.mixed().required(),
    })
    .nullable()
    .required("Penempatan wajib dipilih"),
  role: yup
    .object({
      label: yup.string().required(),
      value: yup.number().required(),
    })
    .required("Role wajib dipilih"),
});

export default memberSchema;
