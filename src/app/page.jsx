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

  return (
    <section className="bg-[#FFF0DC]">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] sm:h-[92dvh]">
        <Image
          src="/banner_home.webp"
          alt="Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 flex items-start justify-end pt-4 sm:pt-8 px-4 sm:px-0">
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
          <span className="text-nowrap">Yuk! Lihat lebih lanjut</span>
          <Icon
            icon="ep:arrow-down-bold"
            width={12}
            color="black"
            className="animate-bounce"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 sm:py-12 px-4 sm:px-8 flex justify-center bg-white">
        <div className="w-full max-w-[1200px]">
          <SectionTitle color="#F0BB78" title="indahnya berdonasi" />
          <div className="flex justify-center flex-wrap gap-4 sm:gap-5">
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
      <section className="py-10 sm:py-12 px-4 sm:px-8 flex justify-center bg-[#543a14]">
        <div className="w-full max-w-[1005px]">
          <SectionTitle color="#FFF0DC" title="terimakasih para donatur" />

          <div className="flex flex-col gap-6">
            {/* Statistik Donatur */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {analyticsTotalList.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#FFF0DC] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-lg font-bold gap-2 w-full sm:w-fit"
                >
                  {isLoadingFetchAnalytics ? (
                    <ClipLoader
                      color="#F0BB78"
                      loading={isLoadingFetchAnalytics}
                      size={32}
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl md:text-[32px] text-[#F0BB78] text-center">
                      {item.value}
                    </span>
                  )}
                  <span className="text-sm sm:text-base md:text-xl text-[#543a14] text-center">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Card Testimoni */}
            <div className="bg-[#FFF0DC] rounded-2xl px-4 sm:px-6 py-8 flex flex-col justify-center items-center lg:h-95">
              <div className="flex flex-col items-center gap-3 sm:gap-0 w-full">
                {isLoadingFetchTestimonies ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <ClipLoader
                      color="#F0BB78"
                      loading={isLoadingFetchTestimonies}
                      size={32}
                    />
                  </div>
                ) : dataTestimonies?.length === 0 ? (
                  <div className="flex flex-col justify-center items-center text-center text-[#543A14]">
                    <p className="text-lg sm:text-xl font-bold mb-2">
                      Belum ada testimoni yang tersedia.
                    </p>
                    <p className="text-sm sm:text-base">
                      Jadilah yang pertama memberikan testimoni!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 lg:gap-8 w-full">
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
                      {dataTestimonies?.map((item, index) => {
                        const filePath = item.attachment?.files[0]?.path;

                        return (
                          <div
                            key={index}
                            className={`${
                              index === activeIndex ? "flex" : "hidden"
                            } flex-col lg:flex-row items-center gap-6 lg:gap-[72px] w-full`}
                          >
                            {filePath && (
                              <div className="relative w-full max-w-[280px] md:max-w-[300px] aspect-square">
                                <Image
                                  src={filePath}
                                  alt="Testimonial"
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 flex items-center justify-center lg:h-75">
                              <div className="text-center lg:text-left max-w-md text-sm sm:text-base text-[#543A14]">
                                <p className="text-[#131010] mb-4 md:mb-6">
                                  {item.message}
                                </p>
                                <p className="font-bold">{item.name}</p>
                                <p>{item.title}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

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
                          className={`w-2 h-2 rounded-full cursor-pointer ${
                            index === activeIndex ? "bg-[#543a14]" : "bg-white"
                          }`}
                          onClick={() => setActiveIndex(index)}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kriteria Barang Layak Donasi Section */}
      <section className="py-10 sm:py-12 px-4 sm:px-8 bg-white flex justify-center">
        <div className="w-full">
          <SectionTitle color="#F0BB78" title="kriteria barang layak donasi" />
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-10 sm:gap-20">
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
