"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

function BannerText({ title, subtitle }) {
  return (
    <div className="bg-[#543a14] text-white pl-12 pr-20 h-[130px] flex flex-col justify-center w-fit shadow-lg shadow-neutral-500">
      <h2 className="text-[32px] font-bold mb-2">{title}</h2>
      <p className="text-xl">{subtitle}</p>
    </div>
  );
}
function BenefitCards({ src, alt, text }) {
  return (
    <div className="flex flex-col items-center text-center bg-[#F0BB78] rounded-[20px] shadow-md p-7 gap-4 max-w-[280px]">
      <div className="w-full">
        <Image src={src} alt={alt} width={80} height={80} />
      </div>
      <p className="text-sm text-[#FFFFFF] text-left">{text}</p>
    </div>
  );
}
function Summary({ count, title }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[28px] font-bold text-[#543A14] bg-[#FFF0DC] p-2 rounded-lg">
        {count}
      </p>
      <p className="text-[#FFF0DC] text-2xl font-bold">{title}</p>
    </div>
  );
}
function SectionTitle({ color, title }) {
  return (
    <h2 className={`text-center text-[32px] text-[${color}] font-bold mb-8`}>
      {title.toUpperCase()}
    </h2>
  );
}
function KriteriaCard({ src, alt, title, criteria }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[150px] aspect-auto">
        <Image src={src} alt={alt} fill layout="contain" />
      </div>
      <div>
        <h3 className="text-[#F0BB78] font-bold text-2xl mb-1">{title}</h3>
        <div>
          <div className="mb-4">
            <ul className="flex flex-col gap-2">
              {criteria.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Icon
                    icon={
                      item.type === "allow"
                        ? "icon-park-solid:check-one"
                        : "gridicons:cross-circle"
                    }
                    width={20}
                    height={20}
                    color={item.type === "allow" ? "#1F7D53" : "#E52020"}
                  />
                  <span className="text-[#131010] text-base">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function Home() {
  // State untuk testimonial aktif
  const [activeIndex, setActiveIndex] = useState(0);

  // Fungsi untuk navigasi manual
  const handleSlide = (direction) => {
    setActiveIndex((prevIndex) => {
      if (direction === "prev") {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
      return (prevIndex + 1) % testimonials.length;
    });
  };

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="bg-[#FFF0DC]">
      {/* Hero Section */}
      <section className="relative w-full h-[90dvh]">
        <Image
          src="/banner_home.webp"
          alt="Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 flex items-start justify-end pt-8">
          <div className="flex flex-col gap-4 items-end">
            <BannerText
              title="Dari bekas menjadi berkah."
              subtitle="Mari bantu sesama demi Indonesia makmur"
            />
            <BannerText
              title="Donasikan barang layak pakaimu"
              subtitle="Apapun itu sangat berarti bagi mereka yang membutuhkan"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 flex justify-center bg-white">
        <div className="w-[1200px]">
          <SectionTitle color="#F0BB78" title="indahnya berdonasi" />
          <div className="flex justify-between">
            <BenefitCards
              src="/hand-giving-circle-icon.svg"
              alt="Hand giving a heart"
              text="Berdonasi adalah wujud kasih sayang dan kepedulian, menghadirkan kebahagiaan bagi mereka yang membutuhkan."
            />
            <BenefitCards
              src="/family-circle-icon.svg"
              alt="Family"
              text="Setiap bantuan yang diberikan dapat meringankan beban keluarga yang membutuhkan dan membawa harapan baru."
            />
            <BenefitCards
              src="/chart-circle-icon.svg"
              alt="Up trend chart"
              text="Donasi tidak hanya membantu individu, tetapi juga berkontribusi pada kesejahteraan dan kebaikan masyarakat luas."
            />
            <BenefitCards
              src="/mind-circle-icon.svg"
              alt="Brain inside a head"
              text=" Berbagi dengan orang lain dapat mengurangi stres, menurunkan tekanan darah, dan meningkatkan kualitas hidup secara keseluruhan."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 flex justify-center bg-[#543a14]">
        <div className="w-fit max-w-[1005px]">
          <SectionTitle color="#FFF0DC" title="terimakasih para donatur" />
          {/* Donatur Statistics */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <Summary count="999" title="Donasi Diterima" />
              <Summary count="999" title="Telah Disalurkan" />
              <Summary count="999" title="Tempat Penampungan" />
            </div>
            <div className="bg-[#FFF0DC] rounded-[20px] py-8 px-6">
              <div className="flex gap-8">
                <div className="flex items-center">
                  <button
                    className="cursor-pointer"
                    onClick={() => handleSlide("prev")}
                  >
                    <Icon
                      icon="ep:arrow-left-bold"
                      width={28}
                      color="#543A14"
                    />
                  </button>
                </div>
                <div className="flex gap-[72px]">
                  <Image
                    src={testimonials[activeIndex].image}
                    alt="Testimonial"
                    width={298}
                    height={298}
                    className="rounded-lg"
                  />
                  <div className="flex items-center max-w-[467px]">
                    <div>
                      <p className="text-[#131010] text-base mb-9">
                        {testimonials[activeIndex].text}
                      </p>
                      <p className="text-[#543A14] text-base font-bold">
                        {testimonials[activeIndex].name}
                      </p>
                      <p className="text-[#543A14] text-base">
                        {testimonials[activeIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="cursor-pointer"
                    onClick={() => handleSlide("next")}
                  >
                    <Icon
                      icon="ep:arrow-right-bold"
                      width={28}
                      color="#543A14"
                    />
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === activeIndex ? "bg-[#543a14]" : "bg-white"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kriteria Barang Layak Donasi Section */}
      <section className="py-12 bg-white flex justify-center">
        <div className="w-[1200px]">
          <SectionTitle color="#F0BB78" title="kriteria barang layak donasi" />
          <div className="flex flex-row flex-wrap justify-center gap-20">
            <KriteriaCard
              src="/pile-clothes.svg"
              alt="Pile of clothes"
              title="Pakaian"
              criteria={clothesCriteria}
            />
            <KriteriaCard
              src="/pile-book.webp"
              alt="Pile of book"
              title="Buku"
              criteria={bookCriteria}
            />
            <KriteriaCard
              src="/electronic-junk.svg"
              alt="Electronics"
              title="Elektronik"
              criteria={electronicCriteria}
            />
            <KriteriaCard
              src="/toys.webp"
              alt="Arrange of toys"
              title="Mainan"
              criteria={toyCriteria}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
