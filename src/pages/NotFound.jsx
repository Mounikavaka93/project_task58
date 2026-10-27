import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { buttonClass } from '../components/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <PageContainer className="py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">404</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">This page is not on the board.</h1>
      <p className="mx-auto mt-3 max-w-md text-mute">The link may be mistyped. Head back to the jobs or the home page.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className={buttonClass('primary', 'h-12 px-6')}>
          Home
        </Link>
        <Link to="/jobs" className={buttonClass('secondary', 'h-12 px-6')}>
          Browse jobs
        </Link>
      </div>
    </PageContainer>
  );
}
