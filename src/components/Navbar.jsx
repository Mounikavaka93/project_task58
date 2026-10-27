import { useEffect, useState } from 'react';
import { Bookmark, LogOut, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { buttonClass } from './Button';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Jobs' },
  { to: '/companies', label: 'Companies' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const { user, logout } = useJobs();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const savedCount = user?.saved?.length || 0;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const linkClass = (isActive) =>
    [
      'relative inline-flex h-16 items-center text-sm font-semibold transition-colors',
      isActive ? 'text-forest' : 'text-mute hover:text-ink',
    ].join(' ');

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/95 shadow-sm backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-page items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => linkClass(isActive)}>
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-lime" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <Link
            to="/saved"
            className="relative grid h-10 w-10 place-items-center rounded-lg text-ink transition hover:bg-paper"
            aria-label={`Saved jobs${savedCount ? `, ${savedCount} saved` : ''}`}
          >
            <Bookmark className="h-5 w-5" />
            {savedCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-forest-deep">
                {savedCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm font-semibold text-ink hover:bg-paper"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-sm font-semibold text-forest-deep">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[8rem] truncate lg:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden h-10 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-ink hover:bg-paper lg:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold text-ink hover:bg-paper sm:px-3"
              >
                Log in
              </Link>
              <Link to="/signup" className={`${buttonClass('lime', 'hidden h-10 shrink-0 whitespace-nowrap sm:inline-flex')}`}>
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink hover:bg-paper lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-forest text-white' : 'text-ink hover:bg-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
              {user ? (
                <>
                  <Link to="/dashboard" className={buttonClass('primary', 'h-12')}>
                    Dashboard
                  </Link>
                  <button type="button" onClick={logout} className={buttonClass('secondary', 'h-12')}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={buttonClass('secondary', 'h-12')}>
                    Log in
                  </Link>
                  <Link to="/signup" className={buttonClass('primary', 'h-12')}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
