import { Bookmark, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategory, getCompany } from '../data/catalog';
import { useJobActions } from '../hooks/useJobActions';
import { postedLabel } from '../utils/jobs';
import Button from './Button';
import Monogram from './Monogram';

function Actions({ job }) {
  const { apply, save, busyId, isSaved, isApplied } = useJobActions();
  const saved = isSaved(job.id);
  const applied = isApplied(job.id);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
        onClick={() => save(job.id)}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-white text-forest transition hover:border-forest"
      >
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-forest' : ''}`} />
      </button>
      <Button className="h-11 min-w-[7.5rem] flex-1" loading={busyId === job.id} disabled={applied} onClick={() => apply(job.id)}>
        {applied ? 'Applied' : 'Apply Now'}
      </Button>
    </div>
  );
}

export function JobCardSkeleton({ variant = 'grid' }) {
  if (variant === 'list') {
    return (
      <div className="animate-pulse rounded-xl border border-line bg-white p-5" aria-hidden="true">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-11 w-11 rounded-2xl bg-line" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/2 rounded bg-line" />
            <div className="h-4 w-1/3 rounded bg-line" />
          </div>
          <div className="h-11 w-36 rounded-xl bg-line" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse rounded-xl border border-line bg-white p-5" aria-hidden="true">
      <div className="h-11 w-11 rounded-2xl bg-line" />
      <div className="mt-5 h-4 w-24 rounded bg-line" />
      <div className="mt-3 h-7 w-4/5 rounded bg-line" />
      <div className="mt-4 h-4 w-2/3 rounded bg-line" />
      <div className="mt-8 h-11 w-full rounded-xl bg-line" />
    </div>
  );
}

export default function JobCard({ job, variant = 'grid' }) {
  const company = getCompany(job.companyId);
  const category = getCategory(job.category);
  const { isApplied } = useJobActions();
  if (!company) return null;
  const applied = isApplied(job.id);

  const badges = (
    <div className="flex flex-wrap gap-2">
      {job.featured && (
        <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest-deep">
          Featured
        </span>
      )}
      {applied && (
        <span className="rounded-full bg-forest px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cream">
          Applied
        </span>
      )}
    </div>
  );

  if (variant === 'list') {
    return (
      <article className="rounded-xl border border-line border-l-4 border-l-forest bg-white p-4 transition duration-300 hover:shadow-card sm:p-5">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_11rem_12.5rem]">
          <div className="flex min-w-0 flex-1 gap-3">
            <Monogram name={company.name} color={company.color} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/companies/${company.id}`} className="text-sm font-medium text-mute hover:text-forest">
                  {company.name}
                </Link>
                {badges}
              </div>
              <h2 className="mt-1 font-serif text-2xl leading-tight text-ink">
                <Link to={`/jobs/${job.id}`} className="transition hover:text-forest">
                  {job.title}
                </Link>
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-mute">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {job.type}
                </span>
                <span>{job.workMode}</span>
                <span>{job.experience}</span>
                <span>{postedLabel(job.postedDays)}</span>
              </div>
              <p className="mt-2 text-xs text-mute">{job.tags.slice(0, 3).join(' · ')}</p>
            </div>
          </div>
          <div className="lg:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Package</p>
            <p className="font-semibold text-forest">{job.salary}</p>
            <p className="text-xs text-mute">{category?.name}</p>
          </div>
          <div>
            <Actions job={job} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-forest/40 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <Monogram name={company.name} color={company.color} />
        {badges}
      </div>
      <Link to={`/companies/${company.id}`} className="mt-4 text-sm font-medium text-mute hover:text-forest">
        {company.name}
      </Link>
      <h3 className="mt-1 font-serif text-2xl leading-tight text-ink">
        <Link to={`/jobs/${job.id}`} className="transition hover:text-forest">
          {job.title}
        </Link>
      </h3>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-mute">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span>{job.type}</span>
        <span>{job.experience}</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">Package</p>
          <p className="font-semibold text-forest">{job.salary}</p>
        </div>
      </div>
      <div className="mt-4">
        <Actions job={job} />
      </div>
    </article>
  );
}
