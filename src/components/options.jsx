const statusList = [
  { label: "Semua", value: "" },
  { label: "Pemeriksaan Digital", value: "DIGITAL_CHECKING" },
  { label: "Pengiriman", value: "TRANSPORTING" },
  { label: "Pemeriksaan Digital (Disetujui)", value: "PENDING" },
  { label: "Pemeriksaan Digital (Ditolak)", value: "REJECTED" },
  { label: "Penjemputan", value: "penjemputan" },
  { label: "Dalam Perjalanan", value: "IN_TRANSIT" },
  { label: "Pemeriksaan Fisik", value: "PHYSICAL_CHECKING" },
  { label: "Disimpan", value: "STORED" },
  { label: "Dialihkan", value: "REDIRECTED" },
  { label: "Disalurkan", value: "DISTRIBUTED" },
];

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

export {
  statusList,
  donationTypes,
  shippingTypes,
  electronicOptions,
  days,
  goodsTypes,
};
