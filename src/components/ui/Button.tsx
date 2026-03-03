"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white";
type ButtonSize = "default" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white font-heading font-medium rounded-lg hover:bg-accent-hover hover:translate-y-[-1px] transition-all duration-200",
  secondary:
    "border border-accent text-accent font-heading font-medium rounded-lg hover:bg-accent-light hover:translate-y-[-1px] transition-all duration-200",
  ghost:
    "text-text-secondary font-body hover:text-text-primary transition-colors duration-200",
  white:
    "bg-white text-accent font-heading font-medium rounded-lg hover:bg-white/90 hover:translate-y-[-1px] transition-all duration-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-6 py-3",
  lg: "px-8 py-4 text-lg",
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
    variant !== "ghost" && sizeStyles[size],
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
