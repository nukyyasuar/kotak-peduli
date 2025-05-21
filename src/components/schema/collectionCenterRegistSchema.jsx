import * as yup from "yup";

const collectionCenterRegistSchema = yup.object().shape({
  namaTempatPenampung: yup
    .string()
    .required("Nama tempat penampung wajib diisi.")
    .min(10, "Nama tempat penampung minimal terdiri dari 10 karakter.")
    .max(100, "Nama tempat penampung maksimal terdiri dari 100 karakter."),
  email: yup
    .string()
    .required("Email wajib diisi.")
    .email(
      "Format email salah. Masukkan format email yang valid (contoh: user@example.com)"
    ),
  nomorTelepon: yup
    .string()
    .required("Nomor telepon wajib diisi.")
    .matches(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka.")
    .min(11, "Nomor telepon minimal terdiri dari 11 digit.")
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
  penjemputan: yup
    .string()
    .required("Pilih salah satu ketersediaan penjemputan yang sesuai."),
  batasJarak: yup
    .number()
    .typeError("Batas jarak penjemputan hanya boleh berisi angka.")
    .min(1, "Batas jarak penjemputan minimal 1 km."),
  waktuOperasional: yup.array().min(1, "Waktu operasional wajib diisi."),
  jenisBarang: yup.array().min(1, "Barang donasi wajib diisi."),
  deskripsi: yup
    .string()
    .required("Deskripsi barang donasi wajib diisi.")
    .min(20, "Deskripsi barang donasi minimal terdiri dari 20 karakter.")
    .max(250, "Deskripsi barang donasi maksimal terdiri dari 250 karakter."),
  foto: yup
    .mixed()
    .test("fileSize", "Ukuran file terlalu besar. Maksimal 5MB.", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test(
      "fileType",
      "Format file tidak didukung. Hanya JPG, JPEG, PNG yang diperbolehkan.",
      (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
      }
    ),
});

export default collectionCenterRegistSchema;
