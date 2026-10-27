import {
  experienceOptions,
  getCategory,
  getCompany,
  jobs,
  salaryOptions,
} from '../data/catalog';

export const emptyFilters = {
  q: '',
  location: '',
  types: [],
  experience: [],
  salary: '',
  category: '',
  company: '',
  sort: 'newest',
};

function splitParam(value) {
  return value ? value.split(',').filter(Boolean) : [];
}

export function parseFilters(params) {
  return {
    q: params.get('q') || '',
    location: params.get('location') || '',
    types: splitParam(params.get('type')),
    experience: splitParam(params.get('experience')),
    salary: params.get('salary') || '',
    category: params.get('category') || '',
    company: params.get('company') || '',
    sort: params.get('sort') || 'newest',
  };
}

export function serializeFilters(filters) {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.location) params.location = filters.location;
  if (filters.types.length) params.type = filters.types.join(',');
  if (filters.experience.length) params.experience = filters.experience.join(',');
  if (filters.salary) params.salary = filters.salary;
  if (filters.category) params.category = filters.category;
  if (filters.company) params.company = filters.company;
  if (filters.sort && filters.sort !== 'newest') params.sort = filters.sort;
  return params;
}

function matchesSalary(job, band) {
  const amount = job.salaryMin;
  if (band === '0-10') return amount < 10;
  if (band === '10-20') return amount >= 10 && amount < 20;
  if (band === '20-30') return amount >= 20 && amount < 30;
  if (band === '30+') return amount >= 30;
  return true;
}

export function filterJobs(list, filters) {
  const query = filters.q.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();

  const next = list.filter((job) => {
    const company = getCompany(job.companyId);
    const category = getCategory(job.category);
    if (query) {
      const haystack = [
        job.title,
        company?.name,
        job.location,
        job.workMode,
        job.type,
        category?.name,
        ...(job.tags || []),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (location) {
      const remote = job.workMode === 'Remote' || job.location.toLowerCase() === 'remote';
      if (location === 'remote') {
        if (!remote) return false;
      } else if (!job.location.toLowerCase().includes(location)) {
        return false;
      }
    }
    if (filters.types.length && !filters.types.includes(job.type)) return false;
    if (filters.experience.length && !filters.experience.includes(job.level)) return false;
    if (filters.salary && !matchesSalary(job, filters.salary)) return false;
    if (filters.category && job.category !== filters.category) return false;
    if (filters.company && job.companyId !== filters.company) return false;
    return true;
  });

  const sorted = [...next];
  if (filters.sort === 'salary-high') sorted.sort((a, b) => b.salaryMax - a.salaryMax);
  else if (filters.sort === 'salary-low') sorted.sort((a, b) => a.salaryMin - b.salaryMin);
  else sorted.sort((a, b) => a.postedDays - b.postedDays);
  return sorted;
}

export function activeFilterCount(filters) {
  return [
    filters.location,
    filters.category,
    filters.company,
    filters.salary,
    ...filters.types,
    ...filters.experience,
  ].filter(Boolean).length;
}

export function postedLabel(days) {
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function similarJobs(job, limit = 3) {
  return jobs
    .filter((item) => item.id !== job.id && (item.category === job.category || item.companyId === job.companyId))
    .slice(0, limit);
}

export function experienceLabel(id) {
  return experienceOptions.find((option) => option.id === id)?.label || id;
}

export function salaryLabel(id) {
  return salaryOptions.find((option) => option.id === id)?.label || id;
}
