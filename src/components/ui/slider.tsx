import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { DISTANCE_OPTIONS } from "@/lib/restaurants/types";
import { cn } from "@/lib/utils";

function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbCount = props.value?.length ?? props.defaultValue?.length ?? 1;
  const distanceScale =
    props.min === 0 &&
    props.max === DISTANCE_OPTIONS.length - 1 &&
    props.step === 1 &&
    thumbCount === 1;

  const control = (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-elevated">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-5 rounded-full bg-fg shadow-[var(--shadow-border)] outline-none ring-offset-bg transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-accent/70 active:scale-95"
        />
      ))}
    </SliderPrimitive.Root>
  );

  if (!distanceScale) return control;

  return (
    <>
      {control}
      <div className="mt-2 grid grid-cols-9 text-center text-2xs text-subtle [&+div]:hidden">
        {DISTANCE_OPTIONS.map((miles) => (
          <span key={miles}>{miles}</span>
        ))}
      </div>
    </>
  );
}

export { Slider };