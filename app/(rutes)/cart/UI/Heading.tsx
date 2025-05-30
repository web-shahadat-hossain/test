import React from "react";
const sizes = {
  textmd: "text-[10px] font-medium",
  text3xl: "text-[18px] font-medium",
  text5xl: "text-[22px] font-medium",
  heading3xl: "text-[18px] font-semibold",
  heading5xl: "text-[22px] font-semibold",
  heading6xl: "text-[25px] font-semibold md:text-[23px] sm:text-[21px]",
};
export type HeadingProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;
const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "text3xl",
  as,
  ...restProps
}) => {
  const Component = as || "h6";
  return (
    <Component
      className={`text-black-900 font-inter ${className} ${
        sizes[size] as keyof typeof sizes
      }`}
      {...restProps}
    >
      {" "}
      {children}{" "}
    </Component>
  );
};
export { Heading };
