export function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#3f4ce2] opacity-30 blur-3xl animate-blob" />
      <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-[#12cbf5] opacity-30 blur-3xl animate-blob [animation-delay:-6s]" />
      <div className="absolute left-1/3 top-[28rem] h-72 w-72 rounded-full bg-[#2d2bc7] opacity-25 blur-3xl animate-blob [animation-delay:-12s]" />
    </div>
  );
}
