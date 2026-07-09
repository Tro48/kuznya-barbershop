"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Общая обвязка полей: `<label>` связан с полем по id, ошибка живёт в
 * `aria-describedby`, поле помечается `aria-invalid`. Скринридер зачитывает
 * текст ошибки при переходе в поле, а не молчит.
 */
type FieldShellProps = {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small text-ash tracking-wide uppercase">
        {label}
        {required && (
          <span className="text-brass ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-small text-ash">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

const control =
  "w-full rounded-sm border bg-anvil px-4 text-chalk placeholder:text-ash/70 " +
  "transition-colors duration-200 border-scale hover:border-ash/60 " +
  "focus:border-brass focus:outline-none " +
  "aria-invalid:border-danger aria-invalid:hover:border-danger";

type BaseProps = {
  label: ReactNode;
  hint?: string;
  error?: string;
  className?: string;
};

export function Input({
  label,
  hint,
  error,
  className,
  id: idProp,
  required,
  ref,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        {...props}
        id={id}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "h-12", className)}
      />
    </FieldShell>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  id: idProp,
  required,
  children,
  ref,
  ...props
}: BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & { ref?: Ref<HTMLSelectElement> }) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          {...props}
          id={id}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(control, "h-12 appearance-none pr-10", className)}
        >
          {children}
        </select>
        <svg
          className="text-ash pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </FieldShell>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className,
  id: idProp,
  required,
  ref,
  ...props
}: BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        {...props}
        id={id}
        ref={ref}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, "min-h-28 resize-y py-3", className)}
      />
    </FieldShell>
  );
}

export function Checkbox({
  label,
  error,
  className,
  id: idProp,
  ref,
  ...props
}: Omit<BaseProps, "hint"> &
  InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <input
          {...props}
          type="checkbox"
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "border-scale bg-anvil accent-brass mt-1 size-4 shrink-0 rounded-xs border",
            "aria-invalid:border-danger",
            className,
          )}
        />
        <label htmlFor={id} className="text-small text-ash leading-relaxed">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
