import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import FilterPanel from '../components/FilterPanel';
import JobCard, { JobCardSkeleton } from '../components/JobCard';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { categories, companies, experienceOptions, getCategory, getCompany, jobs, jobTypes } from '../data/catalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  activeFilterCount,
  experienceLabel,
  filterJobs,
  parseFilters,
  salaryLabel,
  serializeFilters,
} from '../utils/jobs';

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const filtered = useMemo(() => filterJobs(jobs, filters), [filters]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const queryKey = params.toString();
  const category = getCategory(filters.category);
  const company = getCompany(filters.company);
  const title = category?.name || company?.name || 'Browse jobs';
  const filterCount = activeFilterCount(filters);

  useDocumentTitle(title);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [queryKey]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  const updateFilters = (partial) => {
    setParams((current) => {
      const parsed = parseFilters(current);
      const next = { ...parsed };
      if (partial.typeToggle) {
        next.types = parsed.types.includes(partial.typeToggle)
          ? parsed.types.filter((item) => item !== partial.typeToggle)
          : [...parsed.types, partial.typeToggle];
      } else if (partial.experienceToggle) {
        next.experience = parsed.experience.includes(partial.experienceToggle)
          ? parsed.experience.filter((item) => item !== partial.experienceToggle)
          : [...parsed.experience, partial.experienceToggle];
      } else {
        Object.assign(next, partial);
      }
      return serializeFilters(next);
    }, { replace: true });
  };

  const clearFilters = () => setParams({}, { replace: true });

  const counts = {
    types: Object.fromEntries(jobTypes.map((type) => [type, jobs.filter((job) => job.type === type).length])),
    experience: Object.fromEntries(
      experienceOptions.map((option) => [option.id, jobs.filter((job) => job.level === option.id).length]),
    ),
    categories: Object.fromEntries(
      categories.map((item) => [item.id, jobs.filter((job) => job.category === item.id).length]),
    ),
  };

  const chips = [];
  if (filters.q) chips.push({ key: 'q', label: filters.q, clear: { q: '' } });
  if (filters.location) chips.push({ key: 'location', label: filters.location, clear: { location: '' } });
  if (category) chips.push({ key: 'category', label: category.name, clear: { category: '' } });
  if (company) chips.push({ key: 'company', label: company.name, clear: { company: '' } });
  if (filters.salary) chips.push({ key: 'salary', label: salaryLabel(filters.salary), clear: { salary: '' } });
  filters.types.forEach((type) => {
    chips.push({
      key: type,
      label: type,
      clear: { types: filters.types.filter((item) => item !== type) },
    });
  });
  filters.experience.forEach((level) => {
    chips.push({
      key: level,
      label: experienceLabel(level),
      clear: { experience: filters.experience.filter((item) => item !== level) },
    });
  });

  const panel = (
    <FilterPanel
      filters={filters}
      onChange={updateFilters}
      onClear={clearFilters}
      resultCount={filtered.length}
      counts={counts}
    />
  );

  return (
    <div>
      <PageHeader eyebrow="Open roles" title={title}>
        {filtered.length} of {jobs.length} roles match your search. Adjust location, type, experience, salary, or category.
      </PageHeader>
      <PageContainer className="py-8 lg:py-10">
        <SearchBar
          query={filters.q}
          location={filters.location}
          onSearch={(next) => updateFilters(next)}
        />

        <div className="mt-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
          {isDesktop && <aside className="sticky top-20">{panel}</aside>}

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-mute" aria-live="polite">
                {loading ? 'Loading roles' : `Showing ${filtered.length} of ${jobs.length}`}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {!isDesktop && (
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-cream px-3 text-sm font-semibold"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {filterCount > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-forest px-1 text-[11px] text-cream">
                        {filterCount}
                      </span>
                    )}
                  </button>
                )}
                <label className="flex items-center gap-2 text-sm text-mute">
                  <span className="sr-only">Sort roles</span>
                  <select
                    value={filters.sort}
                    onChange={(event) => updateFilters({ sort: event.target.value })}
                    className="h-11 rounded-xl border border-line bg-cream px-3 text-sm text-ink outline-none focus:border-forest"
                  >
                    <option value="newest">Newest</option>
                    <option value="salary-high">Package: high to low</option>
                    <option value="salary-low">Package: low to high</option>
                  </select>
                </label>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => updateFilters(chip.clear)}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink ring-1 ring-line transition hover:ring-forest"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {chip.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 space-y-4" aria-busy={loading}>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => <JobCardSkeleton key={index} variant="list" />)
              ) : filtered.length ? (
                filtered.map((job) => <JobCard key={job.id} job={job} variant="list" />)
              ) : (
                <EmptyState title="No roles match" action={null}>
                  Try a broader city, clear a filter, or search for a craft such as design or data.
                  <div className="mt-6">
                    <button type="button" onClick={clearFilters} className="text-sm font-semibold text-forest hover:underline">
                      Clear all filters
                    </button>
                  </div>
                </EmptyState>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      {drawerOpen && !isDesktop && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close filters" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-paper shadow-card">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="text-sm font-semibold text-mute">Refine results</p>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-xl hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <FilterPanel
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
                resultCount={filtered.length}
                counts={counts}
                onDone={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
