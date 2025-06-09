"use client";

import Image from "next/image";

import { IconText } from "src/components/text";
import {
  missionList,
  donationSteps,
  teamMembers,
} from "src/components/options";

function DonationStep({ step, title, desc }) {
  return (
    <div className="text-center px-3 w-full md:w-1/3">
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
    <div className="text-center w-full sm:w-72">
      <div className="w-40 h-40 sm:w-50 sm:h-50 rounded-full bg-[#FFF0DC] overflow-hidden mx-auto mb-4">
        <Image
          src={src}
          alt={alt}
          width={200}
          height={200}
          className="mix-blend-luminosity object-cover w-full h-full"
        />
      </div>
      <p className="font-semibold sm:text-xl">{nim}</p>
      <p className="text-sm sm:text-base">{name}</p>
    </div>
  );
}

export default function About() {
  return (
    <section className="bg-white flex justify-center px-4 md:px-8 py-12">
      <div className="w-full max-w-screen-xl">
        <div className="w-full flex justify-center mb-4">
          <Image
            src="/kotak-peduli-logo-v2.svg"
            alt="Kotak Peduli Logo"
            width={102}
            height={140}
          />
        </div>

        {/* About Section */}
        <h1 className="text-[#543A14] text-2xl md:text-[32px] font-bold text-center mb-4">
          Tentang Kami
        </h1>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="bg-[#543a14] text-white p-6 md:p-8 rounded-lg flex flex-col justify-center w-full lg:w-2/3">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                "Membantu Sesama dengan Barang yang Lebih Bermakna"
              </h2>
              <p className="text-sm md:text-base">
                Kami adalah platform yang memudahkan Anda untuk berdonasi barang
                layak pakai ke tempat penampungan pilihan. Barang yang Anda
                sumbangkan akan melalui proses seleksi dan penyimpanan sebelum
                akhirnya disalurkan kepada individu atau keluarga yang
                benar-benar membutuhkan.
              </p>
            </div>
            <div className="bg-[#543a14] text-white p-6 md:p-8 rounded-lg flex w-full">
              <div className="flex flex-col gap-5 md:flex-row md:gap-5 w-full">
                <div className="w-full md:w-1/2">
                  <h2 className="text-xl md:text-2xl font-bold lg:h-14 mb-3">
                    Visi
                  </h2>
                  <p className="text-sm md:text-base">
                    Menciptakan budaya berbagi untuk kesejahteraan bersama.
                  </p>
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-xl md:text-2xl font-bold lg:h-14 mb-3">
                    Misi
                  </h2>
                  <div className="space-y-2">
                    {missionList.map(({ src, alt, text, iconType }) => (
                      <IconText
                        key={text}
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
          <div className="bg-[#543a14] text-white p-6 md:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
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
          <div className="bg-[#543a14] text-white p-6 md:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
              Tim Kami
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
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
