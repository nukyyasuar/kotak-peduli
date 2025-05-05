"use client";

import Image from "next/image";
import { IconText } from "src/components/text";

function DonationStep({ step, title, desc }) {
  return (
    <div className="text-center px-3 w-1/3">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
        <span className="text-[#5B4224] text-lg font-bold">{step}</span>
      </div>
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <p className="text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
function MemberCard({ src, alt, nim, name }) {
  return (
    <div className="text-center w-72">
      <div className="w-50 h-50 rounded-full bg-[#FFF0DC] overflow-hidden mx-auto mb-4">
        <Image
          src={src}
          alt={alt}
          width={200}
          height={200}
          className="mix-blend-luminosity"
        />
      </div>
      <p className="font-semibold text-xl">{nim}</p>
      <p className="text-base">{name}</p>
    </div>
  );
}

const missionList = [
  {
    src: "simple-icons:task",
    alt: "Task list icon",
    text: "Memfasilitasi donasi barang dengan mudah",
  },
  {
    src: "/hand-giving-brown-icon.svg",
    alt: "Hand giving a heart",
    text: "Memastikan barang diterima oleh mereka yang membutuhkan",
    iconType: "img",
  },
  {
    src: "fluent:bin-recycle-20-filled",
    alt: "Recycle bin",
    text: "Mengurangi limbah dengan memanfaatkan kembali barang",
  },
];
const donationSteps = [
  {
    step: 1,
    title: "Isi Form Donasi",
    desc: "Pilih jenis barang donasi, tempat penampungan yang dituju, dan data barang",
  },
  {
    step: 2,
    title: "Pengiriman/Penjemputan",
    desc: "Mengirim sendiri atau dijemput oleh tempat penampung jika tersedia",
  },
  {
    step: 3,
    title: "Pemeriksaan Kelayakan",
    desc: "Kondisi barang diperiksa oleh tempat penampung",
  },
  {
    step: 4,
    title: "Penyimpanan Sementara",
    desc: "Barang masuk inventaris tempat penampung sebelum disalurkan",
  },
  {
    step: 5,
    title: "Penyaluran Barang",
    desc: "Barang disalurkan ke pihak yang membutuhkan oleh tempat penampung",
  },
];
const teamMembers = [
  {
    src: "/steven.png",
    alt: "Steven image",
    nim: "2502014975",
    name: "Steven Farrelio Jorgensen",
  },
  {
    src: "/nuky.png",
    alt: "Nuky image",
    nim: "2502073794",
    name: "Nuky Yasuar Zamzamy",
  },
  {
    src: "/matthew.png",
    alt: "Matthew image",
    nim: "2504016241",
    name: "Matthew Emmanuel",
  },
];

export default function About() {
  return (
    <section className="bg-white flex justify-center px-8 py-12">
      <div className="w-[1200px]">
        <div className="w-full flex justify-center mb-4">
          <Image
            src="/kotak-peduli-logo-v2.svg"
            alt="Beri Barang Logo"
            width={102}
            height={140}
          />
        </div>

        {/* About Section */}
        <h1 className="text-[#543A14] text-[32px] font-bold text-center mb-4">
          Tentang Kami
        </h1>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between gap-6">
            <div className="bg-[#543A14] text-white p-8 rounded-lg flex flex-col justify-center w-2/3">
              <h2 className="text-xl font-bold mb-3">
                "Membantu Sesama dengan Barang yang Lebih Bermakna"
              </h2>
              <p className="text-base">
                Kami adalah platform yang memudahkan Anda untuk berdonasi barang
                layak pakai ke tempat penampungan pilihan. Barang yang Anda
                sumbangkan akan melalui proses seleksi dan penyimpanan sebelum
                akhirnya disalurkan kepada individu atau keluarga yang
                benar-benar membutuhkan.
              </p>
            </div>
            <div className="bg-[#543A14] text-white p-8 rounded-lg flex">
              <div className="flex gap-5">
                <div className="w-1/2">
                  <h2 className="text-xl font-bold h-14 mb-3">Visi</h2>
                  <p className="text-base">
                    Menciptakan budaya berbagi untuk kesejahteraan bersama.
                  </p>
                </div>
                <div className="w-2/3">
                  <h2 className="text-xl font-bold h-14 mb-3">Misi</h2>
                  <div className="space-y-2">
                    {missionList.map(({ src, alt, text, iconType }) => (
                      <IconText
                        text={text}
                        src={src}
                        alt={alt}
                        iconType={iconType}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Flow */}
          <div className="bg-[#543A14] text-white p-8 rounded-lg">
            <h2 className="text-[32px] font-bold text-center mb-6">
              Alur Donasi
            </h2>
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-y-5">
                {donationSteps.map(({ step, title, desc }) => (
                  <DonationStep
                    key={step}
                    step={step}
                    title={title}
                    desc={desc}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-[#543A14] text-white p-8 rounded-lg">
            <h2 className="text-[32px] font-bold text-center mb-6">Tim Kami</h2>
            <div className="flex justify-between">
              {teamMembers.map(({ src, alt, nim, name }) => (
                <MemberCard
                  key={nim}
                  src={src}
                  alt={alt}
                  nim={nim}
                  name={name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
