"use client";

import * as Slider from "@radix-ui/react-slider";
import { useLocale } from "next-intl";
import { useId, useState } from "react";

interface CalculatorSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  ariaValueText: (value: number) => string;
  suffix?: string;
}

export function CalculatorSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  ariaValueText,
  suffix,
}: CalculatorSliderProps) {
  const id = useId();
  const locale = useLocale();
  const [inputValue, setInputValue] = useState(String(value));

  const commitInput = () => {
    const parsed = Number(inputValue);
    if (Number.isFinite(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setInputValue(String(clamped));
    } else {
      setInputValue(String(value));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="min-w-0 flex-1 text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
        <div className="flex shrink-0 items-center gap-2">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={inputValue}
            onChange={(e) => {
              const raw = e.target.value;
              setInputValue(raw);
              // Recalculate live while typing or using the spinner arrows;
              // out-of-range values are clamped on blur by commitInput.
              const parsed = Number(raw);
              if (raw !== "" && Number.isFinite(parsed) && parsed >= min && parsed <= max) {
                onChange(parsed);
              }
            }}
            onBlur={commitInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            onFocus={(e) => {
              setInputValue(String(value));
              e.currentTarget.select();
            }}
            className="w-16 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-end text-sm font-semibold tabular-nums text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          />
          {suffix && (
            <span className="w-20 text-sm whitespace-nowrap text-[var(--text-secondary)]">{suffix}</span>
          )}
        </div>
      </div>

      <Slider.Root
        className="relative flex h-6 w-full touch-none items-center select-none"
        value={[value]}
        min={min}
        max={max}
        step={step}
        dir={locale === "he" ? "rtl" : "ltr"}
        onValueChange={([v]) => {
          onChange(v);
          setInputValue(String(v));
        }}
      >
        <Slider.Track className="relative h-2 grow overflow-hidden rounded-full bg-[var(--surface)]">
          <Slider.Range className="absolute h-full rounded-full bg-[var(--accent)]" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-6 rounded-full border-2 border-[var(--accent)] bg-[var(--card)] shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          aria-label={label}
          aria-valuetext={ariaValueText(value)}
        />
      </Slider.Root>
    </div>
  );
}
