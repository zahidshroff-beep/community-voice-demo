export function PageIntro({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <header className="mb-6 max-w-3xl">
      <p className="text-sm font-medium text-teal">{kicker}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted">{lede}</p>
    </header>
  );
}
