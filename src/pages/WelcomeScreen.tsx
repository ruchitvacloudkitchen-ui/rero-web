// Full-screen entry banner, shown once per browser session (gated in
// App.tsx via sessionStorage) before Home. Layout/mood borrowed from the
// two reference banner mockups (full-bleed room photo, bold tagline,
// single CTA, logo near the bottom) but reinterpreted in ReRo's actual
// maroon/pink/teal brand palette instead of their gold/dark-green one.
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';

export function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-pink-dark"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(43,5,24,0.55) 0%, rgba(43,5,24,0.55) 45%, rgba(43,5,24,0.92) 100%), url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-6 pt-16 text-center">
        <p className="mb-2 text-[13px] font-medium uppercase tracking-wider text-bright-teal">
          Hyderabad's own
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-white">
          Book a Home Room,
          <br />
          Just Rs 99/hour
        </h1>
        <p className="mt-3 text-sm text-pink-on-dark-soft">
          Real homes near you, hosted by real Hyderabad families.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 pb-10">
        <button
          type="button"
          onClick={onEnter}
          className="w-full max-w-xs rounded-full bg-pink-cta py-3.5 text-base font-semibold text-white shadow-lg"
        >
          Enter ReRo
        </button>
        <img src="/logo.png" alt="ReRo" className="h-14 w-auto" />
      </div>
    </div>
  );
}
