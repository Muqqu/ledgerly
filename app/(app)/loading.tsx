export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-6 h-7 w-48 animate-pulse rounded bg-slate-200" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }, (_, k) => <div key={k} className="card h-24 animate-pulse bg-slate-100" />)}</div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><div className="card h-72 animate-pulse" /><div className="card h-72 animate-pulse" /></div>
    </div>
  );
}
