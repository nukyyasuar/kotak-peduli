import * as yup from "yup";

const shippingDateSchema = yup.object().shape({
  alasan: yup
    .string()
    .required("Alasan penggantian tanggal pengiriman wajib diisi."),
  waktuPengiriman: yup.array().of(
    yup.object().shape({
      tanggal: yup.string().required("Tanggal pengiriman wajib diisi."),
      hour: yup.string().required("Jam pengiriman wajib diisi."),
      minute: yup.string().required("Menit pengiriman wajib diisi."),
    })
  ),
});

export default shippingDateSchema;
