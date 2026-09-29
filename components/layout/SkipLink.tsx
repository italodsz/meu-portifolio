export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="label-mono fixed top-3 left-3 z-[80] -translate-y-24 rounded-full bg-accent px-4 py-3 text-on-accent transition-transform focus:translate-y-0"
    >
      {label}
    </a>
  );
}
