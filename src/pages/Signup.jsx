import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import { inputClass, labelClass } from '../components/styles';
import { useJobs } from '../context/JobContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { authDestination } from '../utils/auth';
import { wait } from '../utils/wait';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { user, signup } = useJobs();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useDocumentTitle('Register');

  if (user) return <Navigate to={authDestination(location)} replace />;

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    await wait(650);
    const result = signup(form);
    if (!result.ok) {
      setLoading(false);
      setErrors({ form: result.message });
    }
  };

  return (
    <AuthShell
      title="Create an account"
      subtitle="Register to save roles and track the ones you apply for."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-forest hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
            {errors.form}
          </p>
        )}
        {[
          ['name', 'Name', 'text', 'name'],
          ['email', 'Email', 'email', 'email'],
        ].map(([key, label, type, auto]) => (
          <label key={key} className="block">
            <span className={labelClass}>{label}</span>
            <input
              type={type}
              autoComplete={auto}
              value={form[key]}
              onChange={set(key)}
              className={`${inputClass} ${errors[key] ? 'border-clay' : ''}`}
              aria-invalid={Boolean(errors[key])}
            />
            {errors[key] && <span className="mt-1 block text-sm text-clay">{errors[key]}</span>}
          </label>
        ))}
        <label className="block">
          <span className={labelClass}>Password</span>
          <span className="relative block">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
              className={`${inputClass} pr-16 ${errors.password ? 'border-clay' : ''}`}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShow((value) => !value)}
              className="absolute inset-y-1 right-1 rounded-lg px-3 text-xs font-semibold text-forest hover:bg-paper"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </span>
          {errors.password && <span className="mt-1 block text-sm text-clay">{errors.password}</span>}
        </label>
        <label className="block">
          <span className={labelClass}>Confirm password</span>
          <input
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.confirm}
            onChange={set('confirm')}
            className={`${inputClass} ${errors.confirm ? 'border-clay' : ''}`}
            aria-invalid={Boolean(errors.confirm)}
          />
          {errors.confirm && <span className="mt-1 block text-sm text-clay">{errors.confirm}</span>}
        </label>
        <Button type="submit" loading={loading} className="h-12 w-full">
          Register
        </Button>
        <p className="text-xs leading-5 text-mute">Demo only. Your password is stored locally in this browser, not on a server.</p>
      </form>
    </AuthShell>
  );
}
