export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-page lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest-deep px-10 py-14 text-cream lg:flex lg:flex-col lg:justify-between xl:px-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">Brightwork</p>
        <div>
          <p className="max-w-md font-serif text-5xl leading-[1.05]">Find work worth showing up for.</p>
          <p className="mt-5 max-w-sm text-base leading-7 text-cream/75">
            Search roles, save a shortlist, and keep every application in one dashboard. Accounts stay in this browser.
          </p>
        </div>
        <p className="text-sm text-cream/60">Sample companies. No server, no inbox.</p>
      </div>
      <div className="flex items-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-serif text-4xl text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-mute">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-mute">{footer}</div>
        </div>
      </div>
    </div>
  );
}
