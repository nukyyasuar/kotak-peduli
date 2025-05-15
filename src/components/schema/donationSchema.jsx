import * as yup from "yup";

const donationSchema = yup.object().shape({
  namaLengkap: yup.string().required("Nama lengkap wajib diisi."),
  nomorTelepon: yup
    .string()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(10, "Nomor telepon minimal terdiri dari 10 digit.")
    .max(13, "Nomor telepon maksimal terdiri dari 13 digit.")
    .matches(
      /^8\d{9,14}$/,
      "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)"
    ),
  alamat: yup
    .object()
    .test("not-empty", "Alamat lengkap wajib diisi.", (value) => {
      return value && value.jalan && value.latitude && value.longitude;
    }),
  tempatPenampung: yup
    .string()
    .required("Pilih salah satu tempat penampung yang sesuai."),
  tipePengiriman: yup
    .string()
    .required("Pilih salah satu tipe pengiriman yang sesuai."),
  barangDonasi: yup
    .array()
    .of(
      yup.object().shape({
        jenis: yup
          .string()
          .required("Pilih satu atau lebih jenis barang yang sesuai."),
        jumlah: yup
          .number()
          .typeError("Jumlah barang wajib diisi.")
          .required("Jumlah barang wajib diisi.")
          .min(1, "Jumlah barang minimal 1."),
        berat: yup
          .number()
          .typeError("Total berat barang wajib diisi.")
          .required("Total berat barang wajib diisi.")
          .min(1, "Total berat barang minimal 1 kg."),
        event: yup.string(),
        foto: yup
          .array()
          .min(1, "Foto barang donasi wajib diunggah.")
          .test(
            "fileSize",
            "Ukuran file terlalu besar. Maksimal 5MB.",
            (files) => {
              return files?.every((file) => file.size <= 5 * 1024 * 1024);
            }
          )
          .test(
            "fileType",
            "Format file tidak didukung. Hanya JPG, JPEG, PNG yang diperbolehkan.",
            (files) => {
              return files?.every((file) =>
                ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
              );
            }
          ),
        tipeElektronik: yup.array().when("jenis", {
          is: "ELECTRONICS",
          then: () =>
            yup
              .array()
              .min(1, "Pilih tipe elektronik yang sesuai.")
              .of(yup.object().required("Tipe elektronik wajib diisi.")),
          otherwise: () => yup.array().notRequired(),
        }),
      })
    )
    .min(1, "Barang donasi wajib diisi."),
});

export default donationSchema;
