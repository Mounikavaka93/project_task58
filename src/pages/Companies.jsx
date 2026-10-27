import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CompanyCard from '../components/CompanyCard';
import EmptyState from '../components/EmptyState';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import { companies } from '../data/catalog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { inputClass } from '../components/styles';

export default function Companies() {
  const [query, setQuery] = useState('');
  useDocumentTitle('Companies');
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return companies;
    return companies.filter((company) =>
      `${company.name} ${company.industry} ${company.location}`.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div>
      <PageHeader eyebrow="Studios and teams" title="Popular companies">
        Eight fictional companies are hiring on this board. Open one to see the roles and a short brief.
      </PageHeader>
      <PageContainer className="py-8 lg:py-12">
        <label className="relative block max-w-md">
          <span className="sr-only">Search companies</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, industry, or city"
            className={`${inputClass} pl-10`}
          />
        </label>
        {visible.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title="No companies found">Try another name or clear the search.</EmptyState>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
