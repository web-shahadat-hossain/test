"use client";
import React from "react";
const shapes = { square: "rounded-[0px]", round: "rounded-lg" } as const;
const variants = {
  fill: { gray_100: "bg-gray-100 text-gray-900" },
} as const;
const sizes = {
  sm: "h-[22px] px-3 text-[16px]",
  "2xl": "h-[46px] px-3.5 text-[16px]",
} as const;
type InputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "prefix" | "size"
> &
  Partial<{
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;
// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "fill",
      size = "2xl",
      color = "gray_100",
      ...restProps
    },
    ref
  ) => {
    return (
      <label
        className={`${className} flex items-center justify-center cursor-text text-[16px]  ${
          shape && shapes[shape]
        } ${
          variant &&
          (variants[variant]?.[
            color as keyof (typeof variants)[typeof variant]
          ] ||
            variants[variant])
        } ${size && sizes[size]}`}
      >
        {" "}
        {!!label && label} {!!prefix && prefix}{" "}
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          className="!py-2 "
          {...restProps}
        />{" "}
        {!!suffix && suffix}{" "}
      </label>
    );
  }
);
export { Input };
