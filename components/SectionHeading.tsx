import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600 dark:text-gold-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-serif text-3xl font-semibold text-slate-900 dark:text-gold-50 sm:text-4xl">
        {title}
      </h2>
      <div
        className={cn(
          "mt-4 flex items-center gap-2",
          align === "center" && "justify-center"
        )}
      >
        <span className="h-px w-10 bg-brand-400" aria-hidden />
        <span className="size-1.5 rotate-45 bg-gold-400" aria-hidden />
        <span className="h-px w-10 bg-brand-400" aria-hidden />
      </div>
      {description ? (
        <p className="text-pretty mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}