import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Button from '../components/Button';
import { useJobs } from '../context/JobContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { authDestination } from '../utils/auth';
import { wait } from '../utils/wait';
import { inputClass, labelClass } from '../components/styles';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { user, login } = useJobs();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useDocumentTitle('Log in');

  if (user) return <Navigate to={authDestination(location)} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!emailPattern.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    await wait(600);
    const result = login({ email, password });
    if (!result.ok) {
      setLoading(false);
      setErrors({ form: result.message });
    }
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Use the email and password you registered in this browser."
      footer={
        <>
          New to Brightwork?{' '}
          <Link to="/signup" state={location.state} className="font-semibold text-forest hover:underline">
            Register
          </Link>
        </>
      }
    >
      {location.state?.message && (
        <p className="mb-4 rounded-xl bg-lime/60 px-3 py-2 text-sm text-forest-deep">{location.state.message}</p>
      )}
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" className="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
            {errors.form}
          </p>
        )}
        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${inputClass} ${errors.email ? 'border-clay' : ''}`}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="mt-1 block text-sm text-clay">{errors.email}</span>}
        </label>
        <label className="block">
          <span className={labelClass}>Password</span>
          <span className="relative block">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
        <Button type="submit" loading={loading} className="h-12 w-full">
          Log in
        </Button>
        <p className="text-xs leading-5 text-mute">Demo only. Accounts stay on this device and are not sent anywhere.</p>
      </form>
    </AuthShell>
  );
}
