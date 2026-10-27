const variants = {
  primary: 'bg-forest text-cream hover:bg-forest-mid',
  lime: 'bg-lime text-forest-deep hover:bg-lime-deep',
  secondary: 'border border-line bg-cream text-ink hover:border-forest/30 hover:bg-white',
  ghost: 'text-ink hover:bg-paper',
  light: 'bg-cream text-forest hover:bg-white',
};

export function buttonClass(variant = 'primary', className = '') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
    'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant] || variants.primary,
    className,
  ].join(' ');
}

export function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClass(variant, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
