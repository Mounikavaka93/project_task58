import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import { buttonClass } from '../components/Button';
import { categories, companies, jobs } from '../data/catalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const values = [
  {
    title: 'Useful detail',
    body: 'Pay, level, location, and how the work is done are visible before you open a role.',
  },
  {
    title: 'A shortlist',
    body: 'Save roles and return when you have time. Applications sit beside them in your dashboard.',
  },
  {
    title: 'Nothing extra',
    body: 'No feed and no clutter. Search, compare, and decide.',
  },
];

export default function About() {
  useDocumentTitle('About');

  return (
    <div>
      <PageHeader eyebrow="About Brightwork" title="A quieter place to look for work.">
        Brightwork is a demonstration job board. The companies, salaries, and openings are fictional, so you can try the full flow in the browser.
      </PageHeader>
      <PageContainer className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div className="space-y-4 text-base leading-7 text-mute">
          <p>
            The board is organized into six disciplines: software, data, design, marketing, finance, and human resources. Every card carries the comparisons people actually make.
          </p>
          <p>
            Create an account to save a shortlist and record applications. Nothing is sent to a server. Your profile, saved roles, and applications stay in this browser.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [jobs.length, 'Roles'],
            [companies.length, 'Companies'],
            [categories.length, 'Fields'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-line bg-cream px-3 py-5 text-center">
              <p className="font-serif text-3xl text-forest sm:text-4xl">{value}</p>
              <p className="mt-1 text-xs text-mute sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </PageContainer>
      <PageContainer className="pb-16">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">What we kept</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-xl border border-line bg-white p-6">
              <h3 className="text-xl font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{value.body}</p>
            </article>
          ))}
        </div>
        <Link to="/jobs" className={`${buttonClass('primary', 'mt-10 h-12 px-6')}`}>
          Browse open roles
        </Link>
      </PageContainer>
    </div>
  );
}
