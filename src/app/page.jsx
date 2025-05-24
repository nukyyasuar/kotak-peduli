"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

import { getAnalytics } from "src/services/api/analytic";
import { getTestimonies } from "src/services/api/testimony";

import {
  BannerText,
  BenefitCards,
  SectionTitle,
  KriteriaCard,
} from "src/components/homepage";
import {
  testimonials,
  clothesCriteria,
  bookCriteria,
  electronicCriteria,
  toyCriteria,
} from "src/components/options";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dataAnalytics, setDataAnalytics] = useState(null);
  const [dataTestimonies, setDataTestimonies] = useState(null);
  const [isLoadingFetchAnalytics, setIsLoadingFetchAnalytics] = useState(false);
  const [isLoadingFetchTestimonies, setIsLoadingFetchTestimonies] =
    useState(false);

  const analyticsTotalList = [
    {
      label: "Total Tempat Penampung",
      value: dataAnalytics?.collectionCenters,
    },
    {
      label: "Total Donasi Diterima",
      value: dataAnalytics?.completedDonations,
    },
    {
      label: "Total Donasi Disalurkan",
      value: dataAnalytics?.distributedDonations,
    },
  ];

  const handleSlide = (direction) => {
    setActiveIndex((prevIndex) => {
      if (direction === "prev") {
        return prevIndex === 0 ? dataTestimonies?.length - 1 : prevIndex - 1;
      }
      return (prevIndex + 1) % dataTestimonies?.length;
    });
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoadingFetchAnalytics(true);

      const result = await getAnalytics();
      setDataAnalytics(result.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoadingFetchAnalytics(false);
    }
  };

  const fetchTestimonies = async () => {
    try {
      setIsLoadingFetchTestimonies(true);

      const result = await getTestimonies();
      setDataTestimonies(result.data);
    } catch (error) {
      console.error("Error fetching testimonies:", error);
    } finally {
      setIsLoadingFetchTestimonies(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchTestimonies();
  }, []);

  console.log("Data testimonies:", dataTestimonies);

  return (
    <section className="bg-[#FFF0DC]">
      {/* Hero Section */}
      <section className="relative w-full h-[92dvh]">
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

        {/* Scroll */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 text-gray-700 text-sm">
          <span>Yuk! Lihat lebih lanjut</span>
          <Icon
            icon="ep:arrow-down-bold"
            width={12}
            color="black"
            className="animate-bounce"
          />
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
            <div className="flex justify-center gap-8">
              {analyticsTotalList.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#FFF0DC] flex flex-col items-center justify-center p-8 rounded-lg font-bold gap-2"
                >
                  {isLoadingFetchAnalytics ? (
                    <ClipLoader
                      color="#F0BB78"
                      loading={isLoadingFetchAnalytics}
                      size={32}
                    />
                  ) : (
                    <span className="text-[32px] text-[#F0BB78]">
                      {item.value}
                    </span>
                  )}
                  <span className="text-xl text-[#543a14]">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Card Testimoni */}
            <div className="bg-[#FFF0DC] rounded-2xl px-6 h-90 flex flex-col justify-center items-center">
              <div className="flex gap-8">
                {/* Tombol Prev */}
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

                {/* Konten Testimoni */}
                {isLoadingFetchTestimonies ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <ClipLoader
                      color="#F0BB78"
                      loading={isLoadingFetchTestimonies}
                      size={32}
                    />
                  </div>
                ) : (
                  dataTestimonies?.length > 0 &&
                  dataTestimonies?.map((item, index) => {
                    const filePath = item.attachment?.files[0]?.path;

                    return (
                      <div
                        key={index}
                        className={`${
                          index === activeIndex ? "block" : "hidden"
                        } flex items-center gap-[72px] h-75`}
                      >
                        {filePath && (
                          <div className="relative w-75 aspect-square">
                            <Image
                              src={filePath || ""}
                              alt="Testimonial"
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <div
                          className={`flex items-center ${filePath ? "w-[467px]" : "w-full"}`}
                        >
                          <div>
                            <p className="text-[#131010] text-base mb-9">
                              {item.message}
                            </p>
                            <p className="text-[#543A14] text-base font-bold">
                              {item.name}
                            </p>
                            <p className="text-[#543A14] text-base">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Tombol Next */}
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

              {/* Bullet Point */}
              <div className="flex justify-center gap-3 mt-3">
                {dataTestimonies?.map((_, index) => (
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
