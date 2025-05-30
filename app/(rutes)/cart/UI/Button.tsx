import React from "react";
const shapes = { round: "rounded-[20px]" } as const;
const variants = {
  fill: { orange_A700: "bg-orange-a700 shadow-bs text-white-a700" },
} as const;
const sizes = {
  "3xl": "h-[56px] px-6 text-[22px]",
  xl: "h-[44px] px-[30px] text-[18px]",
  "4xl": "h-[66px] px-[34px] text-[22px]",
} as const;
type ButtonProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: () => void;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "3xl",
  color = "orange_A700",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex flex-row items-center justify-center sm:px-5 text-center cursor-pointer whitespace-nowrap text-white font-medium bg-[#FF5C00] shadow-bs ${
        shape && shapes[shape]
      } ${size && sizes[size]} ${
        variant &&
        variants[variant]?.[color as keyof (typeof variants)[typeof variant]]
      }`}
      {...restProps}
    >
      {" "}
      {!!leftIcon && leftIcon} {children} {!!rightIcon && rightIcon}{" "}
    </button>
  );
};
export { Button };
