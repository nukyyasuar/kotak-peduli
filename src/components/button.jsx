import { Icon } from "@iconify/react";

const baseClass =
  "text-base py-2 rounded-lg font-bold px-7 flex items-center justify-center gap-1";
const variantStyles = {
  white: "bg-white text-[#543A14] border border-[#543A14]hover:text-white",
  brown: "bg-[#543a14] text-white hover:bg-[#6B4D20] hover:text-white",
  orange: "bg-[#F0BB78] text-white hover:bg-[#E09359]",
  outlineOrange:
    "border border-[#F0BB78] text-black hover:bg-[#F0BB78] hover:text-white",
  outlineBrown:
    "border border-[#543A14] text-black hover:bg-[#543a14] hover:text-white",
};

const ButtonCustom = ({
  label,
  onClick,
  variant,
  icon,
  className,
  type,
  newKey,
  disabled,
}) => {
  return (
    <button
      type={type}
      key={newKey}
      className={`${baseClass} ${variantStyles[variant]} ${className} ${disabled ? `cursor-not-allowed` : `cursor-pointer`}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon icon={icon} width={20} height={20} />}
      {label}
    </button>
  );
};

export { ButtonCustom };
