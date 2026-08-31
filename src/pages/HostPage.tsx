import { Link } from 'react-router-dom';
import { CallToBookBar } from '../components/layout/CallToBookBar';

// Matches rero_become_a_host_page.html exactly, section for section: header
// (back label + tagline card + eyebrow + heading + price + description +
// CTA), info banner, Host Shield checklist, 3-icon feature row, final CTA +
// chat link. This is the marketing/pitch page — actually submitting a
// listing happens on HostApplyPage, reached via the CTA buttons here.
export function HostPage() {
  return (
    <div>
      <CallToBookBar />
      <div className="bg-pink-dark px-4 py-4">
        <Link to="/profile" className="mb-3 flex items-center gap-2 text-sm text-pink-on-dark-soft">
          <span aria-hidden>←</span> Become a Host
        </Link>

        <div className="mb-3.5 flex items-center gap-1.5 rounded-[10px] bg-pink-dark-2 px-3 py-2">
          <span aria-hidden className="text-sm text-bright-teal">✨</span>
          <span className="text-xs font-medium text-pink-on-dark-soft">Refresh. Rest. Reset.</span>
        </div>

        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-bright-teal">
          For Hyderabad homeowners
        </p>
        <p className="mb-2.5 text-[22px] font-semibold leading-tight text-white">
          Your spare room could earn on ReRo
        </p>
        <div className="mb-1 flex items-baseline gap-1.5">
          <span className="text-[32px] font-extrabold leading-none text-bright-teal">Rs 99</span>
          <span className="text-[13px] text-pink-on-dark-soft">/ hour, per guest</span>
        </div>
        <p className="mb-3.5 text-xs text-pink-on-dark-soft">
          Just 2 hours a day of guests could add over Rs 6,000 a month.
        </p>
        <Link
          to="/host/apply"
          className="block w-full rounded-lg bg-pink-cta py-3 text-center text-sm font-medium text-white"
        >
          List your room
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-teal-tint px-4 py-3.5">
        <span aria-hidden className="text-base text-on-teal">👥</span>
        <span className="text-xs text-on-teal">120+ verified hosts already earning near you</span>
      </div>

      <div className="p-4">
        <h2 className="mb-2.5 text-[15px] font-semibold text-gray-900">ReRo Host Shield</h2>
        <div className="flex flex-col gap-2.5">
          {[
            'Guest ID verification before every booking',
            '24×7 host support line',
            'Room damage protection on every stay',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span aria-hidden className="text-teal-cta">✓</span>
              <span className="text-[13px] text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <h2 className="mb-3 text-[15px] font-semibold text-gray-900">Hosting with ReRo</h2>
        <div className="grid grid-cols-3 gap-2.5 text-center">
          {[
            { icon: '⚡', bg: 'bg-pink-tint', color: 'text-on-pink', title: 'List in minutes', sub: "A few photos and your room's live" },
            { icon: '🪙', bg: 'bg-teal-tint', color: 'text-on-teal', title: 'Keep most of it', sub: 'Low service fee, paid out weekly' },
            { icon: '⚙️', bg: 'bg-pink-tint', color: 'text-on-pink', title: 'Stay in control', sub: 'Set your own hours and price' },
          ].map((f) => (
            <div key={f.title}>
              <div className={`mx-auto mb-1.5 flex h-11 w-11 items-center justify-center rounded-full ${f.bg}`}>
                <span aria-hidden className={`text-lg ${f.color}`}>{f.icon}</span>
              </div>
              <p className="mb-0.5 text-[11px] font-medium text-gray-900">{f.title}</p>
              <p className="text-[10px] text-gray-500">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8">
        <Link
          to="/host/apply"
          className="mb-2.5 block w-full rounded-lg bg-pink-cta py-3 text-center text-sm font-medium text-white"
        >
          Become a Host
        </Link>
        <a href="tel:8999999333" className="flex items-center justify-center gap-1.5">
          <span aria-hidden className="text-sm text-teal-cta">💬</span>
          <span className="text-xs text-teal-cta">Have questions? Chat with us</span>
        </a>
      </div>
    </div>
  );
}
