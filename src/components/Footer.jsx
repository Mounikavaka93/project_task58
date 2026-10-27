import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/catalog';
import Logo from './Logo';

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-cream transition duration-200 hover:bg-lime hover:text-forest-deep"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-auto bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-6 text-cream/75">
            A calmer job board for software, data, design, marketing, finance, and people teams.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ['Home', '/'],
              ['Jobs', '/jobs'],
              ['Companies', '/companies'],
              ['About', '/about'],
              ['Saved jobs', '/saved'],
              ['Dashboard', '/dashboard'],
              ['Log in', '/login'],
              ['Register', '/signup'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-cream/75 transition hover:text-lime">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">Categories</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/jobs?category=${category.id}`}
                  className="text-cream/75 transition hover:text-lime"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lime">Job alerts</h2>
          <p className="mt-4 text-sm leading-6 text-cream/75">
            Leave an email for a future alert. This preview only confirms the form.
          </p>
          {done ? (
            <p className="mt-4 rounded-xl bg-white/10 px-3 py-3 text-sm" role="status">
              Thanks. Email alerts are not sent in this preview.
            </p>
          ) : (
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                setDone(true);
                setEmail('');
              }}
            >
              <label className="sr-only" htmlFor="alert-email">
                Email address
              </label>
              <input
                id="alert-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="h-11 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-cream outline-none placeholder:text-cream/45 focus:border-lime"
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-lime px-4 text-sm font-semibold text-forest-deep transition hover:bg-lime-deep"
              >
                Notify me
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-xs leading-5 text-cream/60">
            © {new Date().getFullYear()} Brightwork. Sample listings for demonstration. Companies and roles are fictional.
          </p>
          <div className="flex gap-2">
            <SocialLink href="https://www.linkedin.com" label="LinkedIn">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M4.7 3.4A2.2 2.2 0 1 0 4.7 7.8 2.2 2.2 0 0 0 4.7 3.4ZM3 9h3.4v12H3V9Zm6.2 0H12.5v1.6h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V21H16v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21H9.2V9Z" />
              </svg>
            </SocialLink>
            <SocialLink href="https://x.com" label="X">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.3 3H3.5l7 10L3.5 21h1.6l6.1-6.8L14.6 21h5.8l-7.3-10.7Zm-2.2 2.4-.7-1L5.7 4.2h2.4l4.5 6.4.7 1 5.9 8.2h-2.4l-4.8-6.8Z" />
              </svg>
            </SocialLink>
            <SocialLink href="https://www.instagram.com" label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </SocialLink>
            <SocialLink href="https://github.com" label="GitHub">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5A10.2 10.2 0 0 0 22 12.2C22 6.6 17.5 2 12 2Z" />
              </svg>
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
