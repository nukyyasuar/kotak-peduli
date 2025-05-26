"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";

const BannerText = ({ title, subtitle }) => {
  return (
    <div className="bg-[#543a14] text-white px-4 sm:px-8 md:px-12 py-4 h-auto sm:h-[130px] flex flex-col justify-center w-fit shadow-lg shadow-neutral-500">
      <h2 className="text-[20px] sm:text-[24px] md:text-[32px] font-bold mb-2">
        {title}
      </h2>
      <p className="text-base sm:text-lg md:text-xl">{subtitle}</p>
    </div>
  );
};

const BenefitCards = ({ src, alt, text }) => {
  return (
    <div className="flex flex-col items-center text-center bg-[#F0BB78] rounded-[20px] shadow-md p-4 sm:p-6 md:p-7 gap-4 max-w-[240px] sm:max-w-[260px] md:max-w-[280px]">
      <div className="w-full">
        <Image src={src} alt={alt} width={80} height={80} />
      </div>
      <p className="text-sm sm:text-base text-white text-left">{text}</p>
    </div>
  );
};

const Summary = ({ count, title }) => {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[22px] sm:text-[24px] md:text-[28px] font-bold text-[#543A14] bg-[#FFF0DC] p-2 sm:p-3 rounded-lg">
        {count}
      </p>
      <p className="text-[#FFF0DC] text-xl sm:text-2xl font-bold">{title}</p>
    </div>
  );
};

const SectionTitle = ({ color, title }) => {
  return (
    <h2
      className={`text-center text-[24px] sm:text-[28px] md:text-[32px] text-[${color}] font-bold mb-6 sm:mb-8`}
    >
      {title.toUpperCase()}
    </h2>
  );
};

const KriteriaCard = ({ src, alt, title, criteria }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-36 aspect-auto">
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
      <div>
        <h3 className="text-[#F0BB78] font-bold text-xl sm:text-2xl mb-1 text-center sm:text-left">
          {title}
        </h3>
        <div className="flex justify-center">
          <ul className="flex flex-col gap-2 mb-4">
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
                <span className="text-[#131010] text-sm sm:text-base">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { BannerText, BenefitCards, Summary, SectionTitle, KriteriaCard };
