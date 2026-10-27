import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthGate from '../components/AuthGate';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import PageContainer from '../components/PageContainer';
import { buttonClass } from '../components/Button';
import { inputClass, labelClass } from '../components/styles';
import { getCompany, getJob } from '../data/catalog';
import { useJobs } from '../context/JobContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../utils/jobs';
import { wait } from '../utils/wait';
import Monogram from '../components/Monogram';

const tabs = [
  { id: 'applied', label: 'Applied' },
  { id: 'saved', label: 'Saved' },
  { id: 'profile', label: 'Profile' },
];

export default function Dashboard() {
  const { user, updateProfile, logout } = useJobs();
  const [tab, setTab] = useState('applied');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    headline: '',
    location: '',
    phone: '',
    skills: '',
    bio: '',
  });
  useDocumentTitle('Dashboard');

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      headline: user.headline || '',
      location: user.location || '',
      phone: user.phone || '',
      skills: user.skills || '',
      bio: user.bio || '',
    });
  }, [user]);

  if (!user) {
    return <AuthGate title="Your dashboard" message="Log in to see applications, saved roles, and your profile." />;
  }

  const applied = user.applied
    .map((record) => ({ record, job: getJob(record.jobId) }))
    .filter((item) => item.job);
  const saved = user.saved.map((id) => getJob(id)).filter(Boolean);
  const completionFields = [user.name, user.email, user.headline, user.location, user.phone, user.skills, user.bio];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);
  const skills = user.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    await wait(500);
    const result = updateProfile(form);
    setSaving(false);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="pb-16">
      <div className="border-b border-line bg-cream">
        <PageContainer className="py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Candidate dashboard</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl text-ink sm:text-5xl">Hello, {user.name.split(' ')[0]}</h1>
              <p className="mt-2 text-mute">
                {user.headline || 'Add a headline so your profile reads like a person, not a form.'}
              </p>
              {user.createdAt && <p className="mt-1 text-sm text-mute">Member since {formatDate(user.createdAt)}</p>}
            </div>
            <button type="button" onClick={logout} className={buttonClass('secondary', 'h-11')}>
              Log out
            </button>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ['applied', 'Applications', applied.length],
              ['saved', 'Saved roles', saved.length],
              ['profile', 'Profile', `${completion}%`],
            ].map(([id, label, value]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  tab === id ? 'border-forest bg-white' : 'border-line bg-paper hover:border-forest/40'
                }`}
              >
                <p className="text-sm text-mute">{label}</p>
                <p className="mt-1 font-serif text-4xl text-ink">{value}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-forest transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-8">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Dashboard sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                tab === item.id ? 'bg-forest text-cream' : 'bg-cream text-ink ring-1 ring-line hover:ring-forest'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'applied' &&
            (applied.length ? (
              <ul className="space-y-3">
                {applied.map(({ record, job }) => {
                  const company = getCompany(job.companyId);
                  return (
                    <li key={record.jobId} className="flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center">
                      {company && <Monogram name={company.name} color={company.color} />}
                      <div className="min-w-0 flex-1">
                        <Link to={`/jobs/${job.id}`} className="font-serif text-2xl text-ink hover:text-forest">
                          {job.title}
                        </Link>
                        <p className="text-sm text-mute">
                          {company?.name} · Applied {formatDate(record.appliedAt)}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-lime px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest-deep">
                        {record.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState title="No applications yet">
                When you apply, the role will show up here with the date.
                <div className="mt-6">
                  <Link to="/jobs" className={buttonClass('primary', 'h-12 px-6')}>
                    Find a role
                  </Link>
                </div>
              </EmptyState>
            ))}

          {tab === 'saved' &&
            (saved.length ? (
              <div className="space-y-4">
                {saved.map((job) => (
                  <JobCard key={job.id} job={job} variant="list" />
                ))}
              </div>
            ) : (
              <EmptyState title="No saved roles">
                Bookmark a job from the board and it will wait for you here.
                <div className="mt-6">
                  <Link to="/jobs" className={buttonClass('primary', 'h-12 px-6')}>
                    Browse jobs
                  </Link>
                </div>
              </EmptyState>
            ))}

          {tab === 'profile' && (
            <form onSubmit={saveProfile} className="rounded-xl border border-line bg-white p-5 sm:p-8" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Name</span>
                  <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />
                </label>
                <label>
                  <span className={labelClass}>Email</span>
                  <input value={user.email} readOnly className={`${inputClass} bg-paper text-mute`} />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Headline</span>
                  <input
                    value={form.headline}
                    onChange={(event) => setForm({ ...form, headline: event.target.value })}
                    placeholder="Product designer focused on civic services"
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>Location</span>
                  <input
                    value={form.location}
                    onChange={(event) => setForm({ ...form, location: event.target.value })}
                    placeholder="Bengaluru"
                    className={inputClass}
                  />
                </label>
                <label>
                  <span className={labelClass}>Phone</span>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="+91"
                    className={inputClass}
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Skills</span>
                  <input
                    value={form.skills}
                    onChange={(event) => setForm({ ...form, skills: event.target.value })}
                    placeholder="React, SQL, Recruiting"
                    className={inputClass}
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Bio</span>
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-line bg-white px-3 py-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
                  />
                </label>
              </div>
              {skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {error && (
                <p role="alert" className="mt-4 text-sm text-clay">
                  {error}
                </p>
              )}
              <Button type="submit" loading={saving} className="mt-6 h-12 px-6">
                Save profile
              </Button>
            </form>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
