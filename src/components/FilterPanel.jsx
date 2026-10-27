import {
  categories,
  companies,
  experienceOptions,
  jobTypes,
  locations,
  salaryOptions,
} from '../data/catalog';
import { labelClass } from './styles';

function CheckRow({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg py-1.5 text-sm text-ink hover:text-forest">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-forest"
        />
        {label}
      </span>
      {typeof count === 'number' && <span className="text-xs text-mute">{count}</span>}
    </label>
  );
}

export default function FilterPanel({ filters, onChange, onClear, resultCount, onDone, counts }) {
  const locationKnown = !filters.location || locations.some((item) => item.toLowerCase() === filters.location.toLowerCase());

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-ink">Filters</h2>
        <button type="button" onClick={onClear} className="text-sm font-semibold text-forest hover:underline">
          Clear
        </button>
      </div>

      <label className="mt-5 block">
        <span className={labelClass}>Location</span>
        <select
          value={locationKnown ? filters.location : filters.location}
          onChange={(event) => onChange({ location: event.target.value })}
          className="h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
        >
          <option value="">All locations</option>
          {!locationKnown && <option value={filters.location}>{filters.location}</option>}
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="mt-5">
        <legend className={labelClass}>Job type</legend>
        {jobTypes.map((type) => (
          <CheckRow
            key={type}
            label={type}
            count={counts?.types?.[type]}
            checked={filters.types.includes(type)}
            onChange={() => onChange({ typeToggle: type })}
          />
        ))}
      </fieldset>

      <fieldset className="mt-5">
        <legend className={labelClass}>Experience</legend>
        {experienceOptions.map((option) => (
          <CheckRow
            key={option.id}
            label={option.label}
            count={counts?.experience?.[option.id]}
            checked={filters.experience.includes(option.id)}
            onChange={() => onChange({ experienceToggle: option.id })}
          />
        ))}
      </fieldset>

      <fieldset className="mt-5">
        <legend className={labelClass}>Salary</legend>
        <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm">
          <input
            type="radio"
            name="salary-band"
            checked={filters.salary === ''}
            onChange={() => onChange({ salary: '' })}
            className="h-4 w-4 accent-forest"
          />
          Any package
        </label>
        {salaryOptions.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm">
            <input
              type="radio"
              name="salary-band"
              checked={filters.salary === option.id}
              onChange={() => onChange({ salary: option.id })}
              className="h-4 w-4 accent-forest"
            />
            {option.label}
          </label>
        ))}
        <p className="mt-2 text-xs leading-5 text-mute">USD contracts are grouped by approximate annual value.</p>
      </fieldset>

      <fieldset className="mt-5">
        <legend className={labelClass}>Category</legend>
        <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm">
          <span className="flex items-center gap-2">
            <input
              type="radio"
              name="category-filter"
              checked={filters.category === ''}
              onChange={() => onChange({ category: '' })}
              className="h-4 w-4 accent-forest"
            />
            All categories
          </span>
        </label>
        {categories.map((category) => (
          <label key={category.id} className="flex cursor-pointer items-center justify-between gap-3 py-1.5 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="category-filter"
                checked={filters.category === category.id}
                onChange={() => onChange({ category: category.id })}
                className="h-4 w-4 accent-forest"
              />
              {category.name}
            </span>
            <span className="text-xs text-mute">{counts?.categories?.[category.id] || 0}</span>
          </label>
        ))}
      </fieldset>

      <label className="mt-5 block">
        <span className={labelClass}>Company</span>
        <select
          value={filters.company}
          onChange={(event) => onChange({ company: event.target.value })}
          className="h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
        >
          <option value="">All companies</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </label>

      {onDone && (
        <button
          type="button"
          onClick={onDone}
          className="mt-6 h-12 w-full rounded-xl bg-forest text-sm font-semibold text-cream transition hover:bg-forest-mid"
        >
          Show {resultCount} {resultCount === 1 ? 'role' : 'roles'}
        </button>
      )}
    </div>
  );
}
