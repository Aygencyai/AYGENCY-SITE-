"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white";
type ButtonSize = "default" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-white font-sans font-semibold text-[13px] uppercase tracking-[0.15em] rounded-full hover:bg-green-light hover:translate-y-[-1px] active:scale-[0.98] transition-all duration-200",
  secondary:
    "border border-green text-green font-sans font-semibold text-[13px] uppercase tracking-[0.15em] rounded-full hover:bg-green/5 hover:translate-y-[-1px] active:scale-[0.98] transition-all duration-200",
  ghost:
    "text-green-muted font-sans hover:text-green active:scale-[0.98] transition-all duration-200",
  white:
    "bg-white text-green font-sans font-semibold text-[13px] uppercase tracking-[0.15em] rounded-full hover:bg-white/90 hover:translate-y-[-1px] active:scale-[0.98] transition-all duration-200",
};

const sizeStyles: Record<ButtonSize, Record<string, string>> = {
  default: {
    primary: "px-8 py-3",
    secondary: "px-8 py-3",
    ghost: "px-0 py-0",
    white: "px-8 py-3",
  },
  lg: {
    primary: "px-9 py-4 text-sm",
    secondary: "px-9 py-4 text-sm",
    ghost: "px-0 py-0 text-lg",
    white: "px-9 py-4 text-sm",
  },
};

export default function Button({
  variant = "primary",
  size = "default",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    variantStyles[variant],
    sizeStyles[size][variant],
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/30 focus-visible:ring-offset-2",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
