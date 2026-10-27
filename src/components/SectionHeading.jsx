export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">{eyebrow}</p>
        )}
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
