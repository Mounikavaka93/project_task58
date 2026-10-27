import { Briefcase, Clock, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import Monogram from '../components/Monogram';
import PageContainer from '../components/PageContainer';
import { getCategory, getCompany, getJob } from '../data/catalog';
import { useJobs } from '../context/JobContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useJobActions } from '../hooks/useJobActions';
import { formatDate, postedLabel, similarJobs } from '../utils/jobs';

function BulletList({ items }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-ink sm:text-base">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function JobDetails() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const company = job ? getCompany(job.companyId) : null;
  const category = job ? getCategory(job.category) : null;
  const { user } = useJobs();
  const { apply, save, busyId, isSaved, isApplied } = useJobActions();
  useDocumentTitle(job ? job.title : 'Role not found');

  if (!job || !company) {
    return (
      <PageContainer className="py-16">
        <EmptyState title="Role not found">
          That opening is not on the board.
          <div className="mt-6">
            <Link to="/jobs" className="text-sm font-semibold text-forest hover:underline">
              Back to jobs
            </Link>
          </div>
        </EmptyState>
      </PageContainer>
    );
  }

  const saved = isSaved(job.id);
  const applied = isApplied(job.id);
  const application = user?.applied?.find((item) => item.jobId === job.id);
  const related = similarJobs(job);
  const facts = [
    ['Package', job.salary],
    ['Job type', job.type],
    ['Experience', job.experience],
    ['Work mode', job.workMode],
    ['Location', job.location],
    ['Category', category?.name || '—'],
    ['Posted', postedLabel(job.postedDays)],
    ['Openings', String(job.spots)],
  ];

  return (
    <div className="pb-16">
      <div className="border-b border-line bg-cream">
        <PageContainer className="py-8 lg:py-12">
          <p className="text-sm text-mute">
            <Link to="/jobs" className="font-medium text-forest hover:underline">
              Jobs
            </Link>
            <span className="px-2">/</span>
            <Link to={`/companies/${company.id}`} className="hover:text-forest">
              {company.name}
            </Link>
          </p>
          <div className="mt-5 flex items-start gap-4">
            <Monogram name={company.name} color={company.color} size="lg" />
            <div className="min-w-0">
              <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">{job.title}</h1>
              <p className="mt-2 text-mute">{company.name}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-mute">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-4 w-4" /> {job.type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {postedLabel(job.postedDays)}
                </span>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-12">
        <article className="order-2 lg:order-1">
          <p className="text-lg leading-8 text-ink">{job.summary}</p>
          <div className="mt-4 space-y-4 text-base leading-7 text-mute">
            {job.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="font-serif text-3xl text-ink">Responsibilities</h2>
            <BulletList items={job.responsibilities} />
          </section>
          <section className="mt-10">
            <h2 className="font-serif text-3xl text-ink">Requirements</h2>
            <BulletList items={job.requirements} />
          </section>
          {job.niceToHave?.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-3xl text-ink">Good to have</h2>
              <BulletList items={job.niceToHave} />
            </section>
          )}
          <section className="mt-10">
            <h2 className="font-serif text-3xl text-ink">Benefits</h2>
            <BulletList items={job.benefits} />
          </section>
          <div className="mt-8 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink ring-1 ring-line">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <aside className="order-1 h-fit rounded-xl border border-line bg-white p-5 lg:sticky lg:top-20 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mute">This role</p>
          <dl className="mt-4 space-y-3">
            {facts.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 text-sm">
                <dt className="text-mute">{label}</dt>
                <dd className="text-right font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-6 text-mute">{company.summary}</p>
          {application && (
            <p className="mt-4 rounded-xl bg-lime/50 px-3 py-2 text-sm text-forest-deep">
              Applied {formatDate(application.appliedAt)} · {application.status}
            </p>
          )}
          <div className="mt-5 space-y-2">
            <Button className="h-12 w-full" loading={busyId === job.id} disabled={applied} onClick={() => apply(job.id)}>
              {applied ? 'Applied' : 'Apply Now'}
            </Button>
            <Button variant="secondary" className="h-12 w-full" onClick={() => save(job.id)}>
              {saved ? 'Saved' : 'Save job'}
            </Button>
          </div>
        </aside>
      </PageContainer>

      {related.length > 0 && (
        <PageContainer>
          <h2 className="font-serif text-3xl text-ink">Similar roles</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <JobCard key={item.id} job={item} />
            ))}
          </div>
        </PageContainer>
      )}
    </div>
  );
}
