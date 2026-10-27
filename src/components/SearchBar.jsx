import { useEffect, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { locations } from '../data/catalog';
import Button from './Button';
import { inputClass, labelClass } from './styles';

export default function SearchBar({ query = '', location = '', onSearch, variant = 'plain' }) {
  const [q, setQ] = useState(query);
  const [loc, setLoc] = useState(location);

  useEffect(() => setQ(query || ''), [query]);
  useEffect(() => setLoc(location || ''), [location]);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch({ q: q.trim(), location: loc.trim() });
      }}
      className={
        variant === 'hero'
          ? 'rounded-xl border border-line bg-paper p-4 sm:p-5'
          : 'rounded-xl border border-line bg-white p-4'
      }
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <label className="min-w-0">
          <span className={labelClass}>Job title or keyword</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Designer, data, React"
              className={`${inputClass} pl-10`}
            />
          </span>
        </label>
        <label className="min-w-0">
          <span className={labelClass}>Location</span>
          <span className="relative block">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <input
              value={loc}
              onChange={(event) => setLoc(event.target.value)}
              placeholder="City or remote"
              list="brightwork-locations"
              className={`${inputClass} pl-10`}
            />
          </span>
        </label>
        <Button type="submit" className="h-12 w-full md:w-auto md:px-6">
          <Search className="h-4 w-4" />
          Search Jobs
        </Button>
      </div>
      <datalist id="brightwork-locations">
        {locations.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
    </form>
  );
}
