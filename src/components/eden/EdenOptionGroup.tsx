"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EdenOption } from "@/lib/eden/questionnaire";

interface EdenOptionGroupProps<T extends string> {
  name: string;
  legend: string;
  options: ReadonlyArray<EdenOption<T>>;
  value: T | T[] | undefined;
  onChange: (value: T) => void;
  onBlur?: () => void;
  multiple?: boolean;
  maxSelections?: number;
  error?: string;
  columns?: 1 | 2;
}

export default function EdenOptionGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  onBlur,
  multiple = false,
  maxSelections,
  error,
  columns = 2,
}: EdenOptionGroupProps<T>) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const errorId = `${name.replace(/\./g, "-")}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="sr-only">{legend}</legend>
      <div
        className={cn(
          "grid gap-3",
          columns === 2 && "md:grid-cols-2"
        )}
      >
        {options.map((option, index) => {
          const selected = selectedValues.includes(option.value);
          const atLimit =
            multiple &&
            maxSelections !== undefined &&
            selectedValues.length >= maxSelections;
          const disabled = Boolean(atLimit && !selected);
          const inputId = `${name.replace(/\./g, "-")}-${option.value}`;

          return (
            <div key={option.value} className="relative min-w-0">
              <input
                id={inputId}
                className="peer sr-only"
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(option.value)}
                onBlur={onBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                data-option-index={index}
              />
              <label
                htmlFor={inputId}
                className={cn(
                  "group flex min-h-[76px] cursor-pointer items-start gap-3 rounded-xl border bg-surface/80 px-4 py-4 text-left transition-all duration-200",
                  "border-ghost/[0.08] hover:-translate-y-0.5 hover:border-cyan/30 hover:bg-surface-light/80 hover:shadow-glow-sm",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-cyan/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-void",
                  "peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-disabled:hover:translate-y-0",
                  selected &&
                    "border-cyan/50 bg-cyan/[0.06] shadow-[inset_0_0_0_1px_rgba(0,229,255,0.08)]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-5 w-5 flex-none items-center justify-center border transition-colors",
                    multiple ? "rounded" : "rounded-full",
                    selected
                      ? "border-cyan bg-cyan text-void"
                      : "border-ghost/20 bg-void-light text-transparent"
                  )}
                >
                  {multiple ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-[15px] font-medium leading-snug text-ghost">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-ghost-dim">
                      {option.description}
                    </span>
                  )}
                </span>
                {index < 9 && (
                  <span
                    aria-hidden="true"
                    className="hidden font-mono text-[10px] text-ghost-dim lg:block"
                  >
                    {index + 1}
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-3 font-sans text-sm text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
