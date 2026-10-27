import { Link } from 'react-router-dom';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 rounded-lg" aria-label="Brightwork home">
      <span
        className={`grid h-9 w-9 place-items-center rounded-md ${
          light ? 'bg-lime text-forest-deep' : 'bg-forest-deep text-white'
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" fill="currentColor" />
          <rect x="9" y="1" width="6" height="6" fill={light ? 'currentColor' : '#FF6B3D'} />
          <rect x="1" y="9" width="6" height="6" fill="currentColor" opacity="0.45" />
          <rect x="9" y="9" width="6" height="6" fill="currentColor" />
        </svg>
      </span>
      <span className={`font-serif text-base font-bold tracking-tight sm:text-lg ${light ? 'text-cream' : 'text-ink'}`}>
        Brightwork
      </span>
    </Link>
  );
}
