import { useJobs } from '../context/JobContext';

const tones = {
  success: 'bg-forest-deep text-cream',
  info: 'bg-ink text-cream',
  error: 'bg-clay text-white',
};

export default function Toasts() {
  const { toasts, dismissToast } = useJobs();
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-80"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm shadow-card animate-fade-up ${tones[toast.tone] || tones.success}`}
        >
          <p>{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="font-semibold"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
