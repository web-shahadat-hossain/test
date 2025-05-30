"use client";

import React from "react";
import Select, { Props as ReactSelectProps } from "react-select";

// ----------------------
// Utility Styles
// ----------------------

const shapes = {
  round: "rounded-lg",
} as const;

const variants = {
  fill: {
    gray_100: "bg-gray-100 text-gray-900",
  },
} as const;

const sizes = {
  "2xl": "h-[46px] px-3.5 text-[16px]",
} as const;

// ----------------------
// Types
// ----------------------

type VariantColorMap = {
  [K in keyof typeof variants]: keyof (typeof variants)[K];
};

type SelectOptionType = {
  value: string;
  label: React.ReactNode;
};

type SelectProps = Omit<ReactSelectProps, "getOptionLabel"> &
  Partial<{
    className: string;
    options: SelectOptionType[];
    isSearchable: boolean;
    isMulti: boolean;
    onChange: (option: any) => void;
    value: string;
    indicator: React.ReactElement;
    getOptionLabel: (e: any) => string;
    children: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: VariantColorMap[keyof VariantColorMap];
  }>;

// ----------------------
// Component
// ----------------------

const SelectBox = React.forwardRef<any, SelectProps>(
  (
    {
      children,
      className = "",
      options = [],
      isSearchable = false,
      isMulti = false,
      indicator,
      shape,
      variant = "fill",
      size = "2xl",
      color = "gray_100",
      ...restProps
    },
    ref
  ) => {
    const [menuPortalTarget, setMenuPortalTarget] =
      React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
      setMenuPortalTarget(document.body);
    }, []);

    return (
      <>
        <Select
          ref={ref}
          options={options}
          className={`${className} flex ${shape && shapes[shape]} ${
            size && sizes[size]
          } ${
            variant &&
            variants[variant]?.[
              color as keyof (typeof variants)[typeof variant]
            ]
          }`}
          isSearchable={isSearchable}
          isMulti={isMulti}
          components={{
            IndicatorSeparator: () => null,
            ...(indicator && { DropdownIndicator: () => indicator }),
          }}
          styles={{
            indicatorsContainer: (provided) => ({
              ...provided,
              padding: undefined,
              flexShrink: undefined,
              width: "max-content",
              "& > div": { padding: 0 },
            }),
            container: (provided) => ({
              ...provided,
              zIndex: 0,
              alignItems: "center",
            }),
            control: (provided) => ({
              ...provided,
              backgroundColor: "transparent",
              border: "0 !important",
              boxShadow: "none !important",
              minHeight: "auto",
              width: "100%",
              flexWrap: undefined,
              "&:hover": { border: "0 !important" },
            }),
            input: (provided) => ({ ...provided, color: "inherit" }),
            option: (provided, state) => ({
              ...provided,
              display: "flex",
              minWidth: "max-content",
              width: "100%",
              backgroundColor: state.isSelected ? "#ff5c00" : "transparent",
              color: state.isSelected ? "#ffffff" : "inherit",
              "&:hover": { backgroundColor: "#ff5c00", color: "#ffffff" },
            }),
            singleValue: (provided) => ({
              ...provided,
              display: "flex",
              marginLeft: undefined,
              marginRight: undefined,
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: 0,
              display: "flex",
              flexWrap: undefined,
            }),
            placeholder: (provided) => ({ ...provided, margin: 0 }),
            menuPortal: (base) => ({ ...base, zIndex: 999999 }),
            menu: (base) => ({
              ...base,
              minWidth: "max-content",
              width: "max-content",
            }),
          }}
          menuPortalTarget={menuPortalTarget}
          closeMenuOnScroll={(event: Event) => {
            const target = event.target as HTMLElement;
            return target?.id === "scrollContainer";
          }}
          {...restProps}
        />
        {children}
      </>
    );
  }
);

SelectBox.displayName = "SelectBox";

export { SelectBox };
