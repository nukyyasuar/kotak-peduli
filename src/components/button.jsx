import { Icon } from "@iconify/react";
import { BeatLoader } from "react-spinners";

const baseClass =
  "text-base py-2 rounded-lg font-bold px-7 flex items-center justify-center gap-1 transition";
const variantStyles = {
  white: "bg-white text-[#543A14] border border-[#543A14]hover:text-white",
  brown: "bg-[#543a14] text-white hover:bg-[#6B4D20] hover:text-white",
  orange: "bg-[#F0BB78] text-white hover:bg-[#E09359]",
  outlineOrange: "border border-[#F0BB78] text-black hover:bg-[#EDEDED]",
  outlineBrown: "border border-[#543A14] text-black hover:bg-[#EDEDED]",
  disabled: "bg-[#EDEDED] text-[#C2C2C2] cursor-not-allowed",
  green: "bg-[#1F7D53] text-white hover:bg-[#1B6846]",
  red: "bg-[#E52020] text-white hover:bg-[#CC1C1C]",
  green: "bg-[#1F7D53] text-white hover:bg-[#1B6846]",
  outlineGreen: "border border-[#1F7D53] hover:bg-[#1F7D53] hover:text-white",
  outlineRed: "border border-[#E52020] hover:bg-[#E52020] hover:text-white",
};

const ButtonCustom = ({
  label,
  onClick,
  variant,
  icon,
  className,
  type,
  disabled,
  isLoading,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`${baseClass} ${variantStyles[`${disabled ? "disabled" : variant}`]} ${className} ${disabled ? `cursor-not-allowed` : `cursor-pointer`}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {isLoading ? (
        <BeatLoader
          color="white"
          loading={isLoading}
          size={5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <>
          {icon && <Icon icon={icon} width={20} height={20} />}
          {label}
        </>
      )}
    </button>
  );
};

export { ButtonCustom };
