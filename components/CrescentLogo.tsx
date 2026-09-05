import { cn } from "@/lib/utils";

/** A crescent-and-star mark used as the Hidayah Hub brand identity. */
export function CrescentLogo({
  className,
  withGlow = false,
}: {
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center",
        withGlow && "after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-gold-300/40 after:blur-lg",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
        <circle cx="24" cy="24" r="22" className="fill-brand-700 dark:fill-brand-800" />
        <circle
          cx="24"
          cy="24"
          r="22"
          className="stroke-gold-400/70"
          strokeWidth="1.5"
        />
        {/* Crescent */}
        <path
          d="M29.5 12.5a13 13 0 1 0 6 18.2 10.5 10.5 0 0 1-6-18.2Z"
          className="fill-gold-300"
        />
        {/* Star */}
        <path
          d="M27.6 27.9l1.35 2.84 3.12.43-2.28 2.2.56 3.12-2.75-1.5-2.75 1.5.56-3.12-2.28-2.2 3.12-.43 1.35-2.84Z"
          className="fill-white"
        />
      </svg>
    </span>
  );
}