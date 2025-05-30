import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Button = (
    props: {
        variant?: "default" | "outline" | "secondary" | "text";
        icon?: React.ReactNode;
    } & ButtonHTMLAttributes<HTMLButtonElement>
) => {
    const { className, children, variant, icon, ...rest } = props;

    return (
        <button
            className={cn(
                `h-[56px] w-[200px] rounded-[20px] px-6 py-3 bg-blazeOrange`,
                variant === "default" &&
                    "bg-blazeOrange text-white hover:bg-blazeOrange/80",
                variant === "outline" &&
                    "border border-blazeOrange text-blazeOrange hover:bg-blazeOrange/10",
                className
            )}
            {...rest}
        >
            <span>{children}</span>
            {icon && <span>{icon}</span>}
        </button>
    );
};

export default Button;
