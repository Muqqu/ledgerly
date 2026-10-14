import clsx from "clsx";
export default function Logo({ className, tile = "bg-indigo-600" }: { className?: string; tile?: string }) {
  return (
    <span aria-hidden="true" className={clsx("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white", tile, className)}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l8-4 8 4-8 4-8-4z" /><path d="M4 12l8 4 8-4" /><path d="M4 17l8 4 8-4" /></svg>
    </span>
  );
}
