import { Link, useLocation } from 'react-router-dom';
import { buttonClass } from './Button';

export default function AuthGate({ title, message }) {
  const location = useLocation();
  const from = `${location.pathname}${location.search}`;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-3 text-mute">{message}</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/login" state={{ from, message }} className={buttonClass('primary', 'h-12 px-6')}>
          Log in
        </Link>
        <Link to="/signup" state={{ from, message }} className={buttonClass('secondary', 'h-12 px-6')}>
          Register
        </Link>
      </div>
    </div>
  );
}
