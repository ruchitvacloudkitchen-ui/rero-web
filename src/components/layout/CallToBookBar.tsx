const SUPPORT_PHONE = '8999 999 333';

export function CallToBookBar() {
  return (
    <a
      href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
      className="flex items-center justify-center gap-1.5 bg-pink-cta px-4 py-1.5 text-white"
    >
      <span aria-hidden className="text-xs">📞</span>
      <span className="text-[11px]">
        Call us to Book now · <strong className="font-medium">{SUPPORT_PHONE}</strong>
      </span>
    </a>
  );
}
