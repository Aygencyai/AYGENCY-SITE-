import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && (
        <p className="text-accent font-heading font-medium text-sm tracking-widest uppercase mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading font-semibold text-text-primary text-4xl md:text-5xl leading-tight mb-6">
        {heading}
      </h2>
      {description && (
        <p
          className={cn(
            "text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
