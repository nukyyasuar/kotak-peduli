import * as yup from "yup";

const testimonySchema = yup.object().shape({
  name: yup.string().required("Nama penerima wajib diisi."),
  title: yup.string().required("Jabatan atau peran wajib diisi."),
  message: yup
    .string()
    .required("Ucapan atau pesan wajib diisi.")
    .min(20, "Ucapan atau pesan minimal terdiri dari 20 karakter.")
    .max(255, "Ucapan atau pesan maksimal terdiri dari 255 karakter."),
  file: yup
    .mixed()
    .test("required", "Foto barang wajib diunggah.", (value) => {
      return value instanceof File;
    })
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

export default testimonySchema;
