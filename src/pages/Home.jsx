import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import CompanyCard from '../components/CompanyCard';
import JobCard, { JobCardSkeleton } from '../components/JobCard';
import PageContainer from '../components/PageContainer';
import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/SectionHeading';
import { buttonClass } from '../components/Button';
import Monogram from '../components/Monogram';
import { categories, companies, getCompany, jobs } from '../data/catalog';
import { useJobs } from '../context/JobContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { emptyFilters, serializeFilters } from '../utils/jobs';

const suggestions = [
  { label: 'Product design', q: 'design' },
  { label: 'Bengaluru', location: 'Bengaluru' },
  { label: 'Remote', location: 'Remote' },
  { label: 'Data Science', q: 'Data Science' },
  { label: 'Internship', q: 'Internship' },
];

const steps = [
  {
    title: 'Search with intent',
    body: 'Filter by city, craft, level, and pay. The useful details are on the card before you open the role.',
  },
  {
    title: 'Keep a shortlist',
    body: 'Save roles to your dashboard and come back when you have the time to read them properly.',
  },
  {
    title: 'Apply in one place',
    body: 'Send an application and see it beside the roles you saved. Everything stays in this browser.',
  },
];

function HeroPreview() {
  const preview = jobs.filter((job) => job.featured).slice(0, 3);
  return (
    <div className="grid min-w-0 gap-3">
      {preview.map((job) => {
        const company = getCompany(job.companyId);
        return (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-paper p-4 transition duration-300 hover:border-forest/40 hover:bg-white"
          >
            <Monogram name={company.name} color={company.color} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-mute">{company.name}</span>
              <span className="mt-0.5 block truncate font-serif text-lg leading-tight text-ink">{job.title}</span>
              <span className="mt-1 block text-xs font-semibold text-forest sm:hidden">{job.salary}</span>
            </span>
            <span className="hidden shrink-0 text-right sm:block">
              <span className="block text-sm font-semibold text-forest">{job.salary}</span>
              <span className="mt-0.5 block text-xs text-mute">{job.location}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useJobs();
  const [ready, setReady] = useState(false);
  useDocumentTitle('');

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 550);
    return () => clearTimeout(timer);
  }, []);

  const featured = jobs.filter((job) => job.featured);
  const stats = [
    { value: String(jobs.length), label: 'Open roles' },
    { value: String(companies.length), label: 'Companies' },
    { value: String(categories.length), label: 'Disciplines' },
  ];

  const goToJobs = (partial) => {
    const search = new URLSearchParams(serializeFilters({ ...emptyFilters, ...partial }));
    const query = search.toString();
    navigate(query ? `/jobs?${query}` : '/jobs');
  };

  return (
    <div>
      <section className="border-b border-line bg-white">
        <PageContainer className="py-10 lg:py-14">
          <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 animate-fade-up">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                <span className="h-2 w-2 rounded-sm bg-lime" />
                Job board
              </p>
              <h1 className="mt-4 max-w-xl font-serif text-3xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
                The right role, with the details in view.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-mute">
                Search sample roles across software, data, design, marketing, finance, and people teams. Save a shortlist and apply when you are ready.
              </p>
              <dl className="mt-8 grid grid-cols-3 border-t border-line pt-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="min-w-0 border-l border-line px-2 first:border-l-0 first:pl-0 sm:px-5">
                    <dt className="font-serif text-2xl text-ink sm:text-4xl">{stat.value}</dt>
                    <dd className="mt-1 text-[11px] leading-4 text-mute sm:text-sm">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <HeroPreview />
          </div>
          <div className="mt-10">
            <SearchBar variant="hero" onSearch={goToJobs} />
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goToJobs({ q: item.q || '', location: item.location || '' })}
                  className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-medium text-ink transition hover:border-forest hover:text-forest"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="py-8 sm:py-12">
        <PageContainer>
          <SectionHeading eyebrow="Browse" title="Job categories" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-8 sm:py-12">
        <PageContainer>
          <SectionHeading
            eyebrow="Selected"
            title="Featured jobs"
            action={
              <Link to="/jobs" className="text-sm font-semibold text-forest hover:underline">
                View all jobs
              </Link>
            }
          />
          {ready ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-live="polite">
              <span className="sr-only">Loading featured jobs</span>
              {Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      <section className="py-8 sm:py-12">
        <PageContainer>
          <SectionHeading eyebrow="How it works" title="Three calm steps" />
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-line border-t-4 border-t-forest bg-white p-6">
                <span className="font-serif text-3xl text-forest">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mute">{step.body}</p>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>

      <section className="py-8 sm:py-12">
        <PageContainer>
          <SectionHeading
            eyebrow="Hiring"
            title="Popular companies"
            action={
              <Link to="/companies" className="text-sm font-semibold text-forest hover:underline">
                All companies
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="pb-16 pt-4 sm:pb-20">
        <PageContainer>
          <div className="overflow-hidden rounded-xl border-l-4 border-lime bg-forest-deep px-6 py-12 text-cream sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <h2 className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
                Your next role can be quieter than the search.
              </h2>
              <p className="mt-3 max-w-xl text-cream/75">
                Browse the board, or create an account to save roles and keep applications together.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link to="/jobs" className={buttonClass('lime', 'h-12 px-6')}>
                Browse jobs
              </Link>
              <Link to={user ? '/dashboard' : '/signup'} className={buttonClass('light', 'h-12 px-6')}>
                {user ? 'Go to dashboard' : 'Create an account'}
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
