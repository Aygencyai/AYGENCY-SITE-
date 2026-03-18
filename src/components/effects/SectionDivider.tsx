interface SectionDividerProps {
  showDot?: boolean;
  className?: string;
}

export default function SectionDivider({ showDot = false, className }: SectionDividerProps) {
  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div className="h-px bg-gradient-to-r from-transparent via-ghost/10 to-transparent" />
      {showDot && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan/40" />
      )}
    </div>
  );
}
