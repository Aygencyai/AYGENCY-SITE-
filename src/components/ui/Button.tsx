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
    "bg-cyan text-void font-heading font-semibold text-[13px] uppercase tracking-[0.15em] rounded-lg hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] transition-all duration-200",
  secondary:
    "border border-cyan/30 text-cyan font-heading font-semibold text-[13px] uppercase tracking-[0.15em] rounded-lg hover:bg-cyan/[0.05] hover:border-cyan/50 active:scale-[0.97] transition-all duration-200",
  ghost:
    "text-ghost-muted font-sans hover:text-cyan active:scale-[0.97] transition-all duration-200",
  white:
    "bg-white text-void font-heading font-semibold text-[13px] uppercase tracking-[0.15em] rounded-lg hover:bg-white/90 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200",
};

const sizeStyles: Record<ButtonSize, Record<string, string>> = {
  default: {
    primary: "px-8 py-3",
    secondary: "px-8 py-3",
    ghost: "px-0 py-0",
    white: "px-8 py-3",
  },
  lg: {
    primary: "px-10 py-4 text-sm",
    secondary: "px-10 py-4 text-sm",
    ghost: "px-0 py-0 text-lg",
    white: "px-10 py-4 text-sm",
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
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/30 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
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
