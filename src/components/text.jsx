import { Icon } from "@iconify/react";
import Image from "next/image";

const IconText = ({ text, src, alt, iconType, variant }) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <div
        className={`h-8 aspect-square rounded-full bg-${variant === "white" ? "[#543A14]" : "white"} flex items-center justify-center`}
      >
        {iconType === "img" ? (
          <Image src={src} alt={alt} width={20} height={20} />
        ) : (
          <Icon
            icon={src}
            width={20}
            height={20}
            color={variant === "white" ? "white" : "#543A14"}
          />
        )}
      </div>
      <p
        className={`text-base ${variant === "white" && "font-bold text-[#543A14]"}`}
      >
        {text}
      </p>
    </div>
  );
};

const TextBetween = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <p>{label}:</p>
      {Array.isArray(value) ? (
        <div>
          {value.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};

export { IconText, TextBetween };
