import * as yup from "yup";

const goodsShelterRegistSchema = yup.object().shape({
  namaTempatPenampung: yup
    .string()
    .required("Nama tempat penampung wajib diisi.")
    .min(10, "Nama tempat penampung minimal terdiri dari 10 karakter.")
    .max(100, "Nama tempat penampung maksimal terdiri dari 100 karakter."),
  email: yup
    .string()
    .required("Email wajib diisi.")
    .email("Format email tidak valid."),
  nomorTelepon: yup
    .number()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(13, "Nomor telepon minimal terdiri dari 13 digit.")
    .max(15, "Nomor telepon maksimal terdiri dari 15 digit.")
    .matches(
      /^8\d{9,14}$/,
      "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)"
    ),
  alamat: yup.string().required("Alamat lengkap wajib diisi."),
  jalan: yup.string().required("Nama jalan wajib diisi."),
  patokan: yup.string().required("Patokan wajib diisi."),
  penjemputan: yup
    .string()
    .required("Pilih salah satu ketersediaan penjemputan yang sesuai."),
  batasJarak: yup
    .number()
    .required("Batas jarak penjemputan wajib diisi.")
    .typeError("Batas jarak penjemputan harus berupa angka.")
    .min(1, "Batas jarak penjemputan minimal 1 km."),
  waktuOperasional: yup.array().of(
    yup.object().shape({
      day: yup.string().required("Hari wajib diisi."),
      openHour: yup.number().required("Jam buka wajib diisi."),
      openMinute: yup.number().required("Menit buka wajib diisi."),
      closeHour: yup.number().required("Jam tutup wajib diisi."),
      closeMinute: yup.number().required("Menit tutup wajib diisi."),
    })
  ),
  jenisBarang: yup.array().min(1, "Barang donasi wajib diisi."),
  deskripsi: yup
    .string()
    .required("Deskripsi barang donasi wajib diisi.")
    .min(20, "Deskripsi barang donasi minimal terdiri dari 20 karakter.")
    .max(250, "Deskripsi barang donasi maksimal terdiri dari 250 karakter."),
  foto: yup
    .mixed()
    .required("Foto barang donasi wajib diunggah.")
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

export default goodsShelterRegistSchema;
