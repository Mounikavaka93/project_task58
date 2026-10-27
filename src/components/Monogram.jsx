function initials(name) {
  const words = name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter((word) => /[A-Za-z]/.test(word[0] || ''));
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

const sizes = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-lg',
};

export default function Monogram({ name, color, size = 'md' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-md font-semibold text-white ${sizes[size] || sizes.md}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
