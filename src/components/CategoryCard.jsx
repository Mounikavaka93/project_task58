import { Code2, Landmark, LineChart, Megaphone, Palette, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobs } from '../data/catalog';

const icons = {
  software: Code2,
  data: LineChart,
  design: Palette,
  marketing: Megaphone,
  finance: Landmark,
  hr: Users,
};

export default function CategoryCard({ category, index = 0 }) {
  const Icon = icons[category.id] || Code2;
  const count = jobs.filter((job) => job.category === category.id).length;

  return (
    <Link
      to={`/jobs?category=${category.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      className="group flex h-full animate-fade-up flex-col rounded-xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-forest/40 hover:shadow-card"
    >
      <span className="grid h-11 w-11 place-items-center rounded-md bg-forest-deep text-white transition duration-300 group-hover:bg-lime group-hover:text-forest-deep">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{category.name}</h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-mute">{category.description}</p>
      <p className="mt-4 text-sm font-semibold text-forest">
        {count} {count === 1 ? 'open role' : 'open roles'}
      </p>
    </Link>
  );
}
