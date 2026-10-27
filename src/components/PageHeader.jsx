import PageContainer from './PageContainer';

export default function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="border-b border-line bg-cream">
      <PageContainer className="py-10 lg:py-14">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">{eyebrow}</p>
        )}
        <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-base leading-7 text-mute">{children}</div>}
      </PageContainer>
    </header>
  );
}
