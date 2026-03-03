import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionContainer({
  children,
  className,
  id,
}: SectionContainerProps) {
  return (
    <div id={id} className={cn("max-w-7xl mx-auto px-6 md:px-8", className)}>
      {children}
    </div>
  );
}
