import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] border border-transparent',
      secondary:
        'bg-[var(--color-surface-subtle)] text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border-hairline)]',
      outline:
        'bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border-hairline)]',
      ghost:
        'bg-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] border border-transparent',
      danger:
        'bg-[var(--color-status-danger)] text-white hover:opacity-95 border border-transparent',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-xs',
      lg: 'px-5 py-2.5 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full px-3 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full px-3 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border-hairline)] rounded-[var(--radius-md)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export function ResilientMediaImage({
  src,
  alt,
  className,
  fallbackTitle,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-[var(--color-surface-subtle)] text-[var(--color-ink-secondary)] p-4 text-center select-none',
          className
        )}
      >
        <span className="text-xs font-medium text-[var(--color-ink)] truncate max-w-full">
          {fallbackTitle || alt}
        </span>
        <span className="text-[11px] font-mono text-[var(--color-ink-muted)] mt-1">
          Studio Media Asset
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}
