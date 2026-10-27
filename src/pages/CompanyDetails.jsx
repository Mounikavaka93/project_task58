import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import Monogram from '../components/Monogram';
import PageContainer from '../components/PageContainer';
import { buttonClass } from '../components/Button';
import { getCompany, jobs } from '../data/catalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function CompanyDetails() {
  const { companyId } = useParams();
  const company = getCompany(companyId);
  const openings = company ? jobs.filter((job) => job.companyId === company.id) : [];
  useDocumentTitle(company ? company.name : 'Company not found');

  if (!company) {
    return (
      <PageContainer className="py-16">
        <EmptyState title="Company not found">
          <Link to="/companies" className="text-sm font-semibold text-forest hover:underline">
            All companies
          </Link>
        </EmptyState>
      </PageContainer>
    );
  }

  const facts = [
    ['Industry', company.industry],
    ['Location', company.location],
    ['Team size', company.employees],
    ['Founded', company.founded],
  ];

  return (
    <div className="pb-16">
      <div className="border-b border-line bg-cream">
        <PageContainer className="py-10">
          <Link to="/companies" className="text-sm font-semibold text-forest hover:underline">
            All companies
          </Link>
          <div className="mt-5 flex items-start gap-4">
            <Monogram name={company.name} color={company.color} size="lg" />
            <div>
              <h1 className="font-serif text-4xl text-ink sm:text-5xl">{company.name}</h1>
              <p className="mt-2 text-mute">{company.industry}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-paper px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-mute">{label}</dt>
                <dd className="mt-1 font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </PageContainer>
      </div>
      <PageContainer className="py-10">
        <p className="max-w-3xl text-base leading-7 text-mute">{company.about}</p>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-3xl text-ink">Open roles</h2>
          <Link to={`/jobs?company=${company.id}`} className={buttonClass('secondary', 'h-11')}>
            View in search
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {openings.map((job) => (
            <JobCard key={job.id} job={job} variant="list" />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
