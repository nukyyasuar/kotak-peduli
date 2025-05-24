// Homepage
const testimonials = [
  {
    name: "Fulani",
    role: "Ketua Pengurus",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam.",
    image: "/reviewer-photo.webp",
  },
  {
    name: "Fulana",
    role: "Ketua Pengurus",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam.",
    image: "/reviewer-photo.webp",
  },
];

const clothesCriteria = [
  { text: "Bersih", type: "allow" },
  { text: "Layak Pakai", type: "allow" },
  { text: "Pakaian Dalam", type: "deny" },
  { text: "Robek", type: "deny" },
];

const bookCriteria = [
  { text: "Terbaca Jelas", type: "allow" },
  { text: "Cover Utuh", type: "allow" },
  { text: "Basah", type: "deny" },
  { text: "Sobek", type: "deny" },
];

const electronicCriteria = [
  { text: "Berfungsi", type: "allow" },
  { text: "Bersih", type: "allow" },
  { text: "Kerusakan Besar", type: "deny" },
  { text: "Komponen Utama Hilang", type: "deny" },
];

const toyCriteria = [
  { text: "Berfungsi", type: "allow" },
  { text: "Aman Untuk Anak-Anak", type: "allow" },
  { text: "Berbahaya", type: "deny" },
  { text: "Rusak Parah", type: "deny" },
];
//

// Navbar
const baseMenuList = [
  { href: "/cerita-kami", text: "Cerita Kami" },
  { href: "/tempat-penampung", text: "Tempat Penampung" },
  { href: "/dashboard", text: "Dashboard", permission: "READ_COLLECTION" },
  {
    href: "/admin/barang-donasi",
    text: "Barang Donasi",
    type: "admin",
    permission: "READ_DONATION",
  },
  {
    href: "/admin/event",
    text: "Event",
    type: "admin",
    permission: "READ_EVENT",
  },
  {
    href: "/admin/cabang",
    text: "Cabang",
    type: "admin",
    permission: "READ_POST",
  },
  {
    href: "/admin/pengurus",
    text: "Pengurus",
    type: "admin",
    permission: "READ_ROLE",
  },
  {
    href: "/admin/akun",
    text: "Akun",
    type: "admin",
    permission: "UPDATE_COLLECTION",
  },
  {
    href: "/admin/testimoni",
    text: "Testimoni",
    type: "admin",
  },
];

const buttonMenuList = [
  { href: "/daftar", text: "Daftar" },
  { href: "/login", text: "Masuk" },
];
//

// Admin/Barang Donasi
const digitalCheckingUpdateStatus = [
  {
    label: "Pemeriksaan Digital (Disetujui)",
    name: "PENDING",
    value: true,
    color: "#1F7D53",
  },
  {
    label: "Pemeriksaan Digital (Ditolak)",
    name: "REJECTED",
    value: false,
    color: "#E52020",
  },
];

const physicalCheckingUpdateStatus = [
  {
    label: "Pemeriksaan Fisik (Disetujui)",
    name: "STORED",
    value: true,
    color: "#1F7D53",
  },
  {
    label: "Pemeriksaan Fisik (Ditolak)",
    name: "REDIRECTED",
    value: false,
    color: "#E52020",
  },
];
//

const statusList = [
  { label: "Semua", value: "" },
  { label: "Pemeriksaan Digital", value: "DIGITAL_CHECKING" },
  { label: "Pemeriksaan Digital (Disetujui)", value: "PENDING" },
  { label: "Proses Konfirmasi Tanggal", value: "CONFIRMING" },
  { label: "Pengiriman Terjadwal", value: "CONFIRMED" },
  { label: "Pemeriksaan Digital (Ditolak)", value: "REJECTED" },
  { label: "Proses Pengiriman", value: "TRANSPORTING" },
  { label: "Proses Penjemputan", value: "PICKING" },
  { label: "Dalam Perjalanan", value: "IN_TRANSIT" },
  { label: "Pemeriksaan Fisik", value: "PHYSICAL_CHECKING" },
  { label: "Disimpan", value: "STORED" },
  { label: "Dialihkan", value: "REDIRECTED" },
  { label: "Disalurkan", value: "DISTRIBUTED" },
];

const STATUS_GREEN = ["PENDING", "DISTRIBUTED", "APPROVED"];
const STATUS_RED = ["REJECTED", "REDIRECTED"];

const donationTypes = [
  { label: "Pakaian", value: "CLOTHES" },
  { label: "Alat Elektronik", value: "ELECTRONICS" },
  { label: "Buku", value: "BOOKS" },
  { label: "Mainan", value: "TOYS" },
];

const shippingTypes = [
  { label: "Dikirim Sendiri", value: "DELIVERED" },
  { label: "Dijemput", value: "PICKED_UP" },
];

const eventStatusList = [
  { label: "Aktif", value: true },
  { label: "Tidak Aktif", value: false },
];

const postTypesList = [
  { label: "Cabang", value: "BRANCH" },
  { label: "Drop Point", value: "DROP_POINT" },
];

const collectionCenterApprovedStatusList = [
  { label: "Disetujui", value: "APPROVED" },
  { label: "Ditolak", value: "REJECTED" },
  { label: "Pengajuan", value: "PENDING" },
];

const memberRolesList = [
  { label: "Admin Utama", value: "Collection Center Admin" },
  { label: "Admin Donasi", value: "Collection Center Donation Admin" },
  { label: "Admin Event", value: "Collection Center Event Admin" },
  { label: "Admin Cabang / Drop Point", value: "Collection Center Post Admin" },
  { label: "Admin Pengurus", value: "Collection Center Role Admin" },
];

const electronicOptions = [
  { label: "Laptop", value: "laptop" },
  { label: "Televisi", value: "tv" },
  { label: "Kulkas", value: "kulkas" },
  { label: "Mesin Cuci", value: "mesin_cuci" },
  { label: "Microwave", value: "microwave" },
  { label: "AC", value: "ac" },
  { label: "Kipas Angin", value: "kipas_angin" },
  { label: "Setrika", value: "setrika" },
  { label: "Blender", value: "blender" },
  { label: "Rice Cooker", value: "rice_cooker" },
  { label: "Speaker", value: "speaker" },
  { label: "Printer", value: "printer" },
  { label: "Monitor", value: "monitor" },
  { label: "Proyektor", value: "proyektor" },
];

const days = [
  { label: "Senin", value: "MONDAY" },
  { label: "Selasa", value: "TUESDAY" },
  { label: "Rabu", value: "WEDNESDAY" },
  { label: "Kamis", value: "THURSDAY" },
  { label: "Jumat", value: "FRIDAY" },
  { label: "Sabtu", value: "SATURDAY" },
  { label: "Minggu", value: "SUNDAY" },
];

const goodsTypes = [
  {
    src: "tabler:book-filled",
    alt: "Book",
    text: "Buku",
    variant: "white",
    value: "BOOKS",
  },
  {
    src: "material-symbols:smart-toy",
    alt: "Robot toy head",
    text: "Mainan",
    variant: "white",
    value: "TOYS",
  },
  {
    src: "healthicons:electricity",
    alt: "Electronic part",
    text: "Alat Elektronik",
    variant: "white",
    value: "ELECTRONICS",
  },
  {
    src: "tabler:shirt-filled",
    alt: "T-shirt",
    text: "Pakaian",
    variant: "white",
    value: "CLOTHES",
  },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextTwoWeeks = new Date();
nextTwoWeeks.setDate(tomorrow.getDate() + 14);

const hours = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 6;
  const value = hour.toString().padStart(2, "0");
  return { label: value, value };
});

const minutes = Array.from({ length: 60 }, (_, i) => ({
  label: i.toString().padStart(2, "0"),
  value: i.toString().padStart(2, "0"),
}));

export {
  testimonials,
  clothesCriteria,
  bookCriteria,
  electronicCriteria,
  toyCriteria,
  baseMenuList,
  buttonMenuList,
  digitalCheckingUpdateStatus,
  physicalCheckingUpdateStatus,
  statusList,
  donationTypes,
  shippingTypes,
  electronicOptions,
  days,
  goodsTypes,
  tomorrow,
  nextTwoWeeks,
  hours,
  minutes,
  eventStatusList,
  postTypesList,
  STATUS_GREEN,
  STATUS_RED,
  memberRolesList,
  collectionCenterApprovedStatusList,
};
