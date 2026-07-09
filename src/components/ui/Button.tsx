import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm border font-display font-semibold " +
  "uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-200 " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  // Латунь — только для действия. Если ею покрашены заголовок, иконка и кнопка,
  // кнопку перестают замечать.
  primary:
    "border-brass bg-brass text-coal hover:border-spark hover:bg-spark aria-busy:hover:bg-brass",
  ghost: "border-scale text-chalk hover:border-brass hover:text-brass bg-transparent",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.9375rem]",
  sm: "h-10 px-4 text-small",
};

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" />
      <path
        d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </svg>
  );
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: Variant;
  size?: Size;
  /** Спиннер + `disabled` + `aria-busy`: повторный клик по кнопке в запросе не пройдёт. */
  pending?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  pending = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {pending && <Spinner />}
      {children}
    </button>
  );
}

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a {...props} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </a>
  );
}
