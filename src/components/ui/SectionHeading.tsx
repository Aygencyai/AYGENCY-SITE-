import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  display?: boolean;
}

export default function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  display = false,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={cn(isCenter && "text-center")}>
      {eyebrow && (
        <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "leading-tight mb-6",
          display
            ? "font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold"
            : "font-heading text-ghost text-4xl md:text-5xl uppercase font-semibold"
        )}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={cn(
            "text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans",
            isCenter && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
