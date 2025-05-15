import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const IconText = ({ text, src, alt, iconType, variant }) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <div
        className={`h-8 aspect-square rounded-full ${variant === "white" ? "bg-[#543A14]" : "bg-white"} flex items-center justify-center`}
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

const TextBetween = ({ label, value, className, type }) => {
  return (
    <div className={`flex justify-between ${className}`}>
      <p>{label}:</p>
      {Array.isArray(value) ? (
        <div>
          {value.map((item, index) => (
            <p
              key={index}
              className={`flex justify-end ${type === "list" && "flex-col"}`}
            >
              {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="flex">{value}</p>
      )}
    </div>
  );
};

const ListTextWithTitle = ({ title, values, className }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-bold">{title}</span>
      {values.map((value, idx) => (
        <span key={idx}>{value}</span>
      ))}
    </div>
  );
};

const Spacer = ({ text }) => {
  return (
    <div className="flex items-center">
      <div className="flex-1 border-t border-[#C2C2C2]" />
      <span className="px-3 text-[#C2C2C2] text-sm">{text}</span>
      <div className="flex-1 border-t border-[#C2C2C2]" />
    </div>
  );
};

const TextWithLink = ({ text, label, href }) => {
  return (
    <div className="text-center">
      <span>
        {text}{" "}
        <Link
          href={href}
          className="hover:underline cursor-pointer font-bold text-[#F0BB78]"
        >
          {label}
        </Link>
      </span>
    </div>
  );
};

export { IconText, TextBetween, ListTextWithTitle, Spacer, TextWithLink };
