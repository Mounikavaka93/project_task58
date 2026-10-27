import { Search } from 'lucide-react';

export default function EmptyState({ icon: Icon = Search, title, children, action }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime text-forest-deep">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-serif text-3xl text-ink">{title}</h2>
      <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-mute">{children}</div>
      {action && <div className="mt-6 flex justify-center gap-3">{action}</div>}
    </div>
  );
}
