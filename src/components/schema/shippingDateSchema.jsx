import * as yup from "yup";

const shippingDateSchema = yup.object().shape({
  alasan: yup.string(),
  // .required("Alasan penggantian tanggal pengiriman wajib diisi."),
  waktuPengiriman: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          date: yup.string(),
          hour: yup.string(),
          minute: yup.string(),
        })
        .test(
          "complete",
          "Tanggal, jam, dan menit harus diisi.",
          (val) => val.date && val.hour && val.minute
        )
    )
    .min(3, "Opsi waktu pengiriman minimal 3.")
    .test(
      "no-duplicates",
      "Opsi waktu pengiriman tidak boleh sama.",
      (items) => {
        if (!Array.isArray(items)) return true;
        const seen = new Set();
        for (const item of items) {
          const key = `${item.date}-${item.hour}-${item.minute}`;
          if (seen.has(key)) return false;
          seen.add(key);
        }
        return true;
      }
    ),
});

export default shippingDateSchema;
