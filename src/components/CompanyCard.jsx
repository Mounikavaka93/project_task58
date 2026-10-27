import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openingsFor } from '../data/catalog';
import Monogram from './Monogram';

export default function CompanyCard({ company }) {
  const openings = openingsFor(company.id);

  return (
    <Link
      to={`/companies/${company.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-forest/40 hover:shadow-card"
    >
      <span className="h-1.5" style={{ backgroundColor: company.color }} />
      <span className="flex flex-1 flex-col p-5">
        <Monogram name={company.name} color={company.color} />
        <h3 className="mt-4 font-serif text-2xl leading-tight text-ink group-hover:text-forest">{company.name}</h3>
        <p className="mt-1 text-sm text-mute">{company.industry}</p>
        <p className="mt-3 flex items-center gap-1 text-sm text-mute">
          <MapPin className="h-3.5 w-3.5" />
          {company.location}
        </p>
        <p className="mt-auto pt-5 text-sm font-semibold text-forest">
          {openings} {openings === 1 ? 'open role' : 'open roles'}
        </p>
      </span>
    </Link>
  );
}
