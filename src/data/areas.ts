// Shared Hyderabad area list — originally inline in HomePage's "Popular
// Hyderabad areas" section, promoted here so the host-apply wizard's
// location step can reuse the exact same set instead of inventing a
// second, possibly-inconsistent list.
export const HYDERABAD_AREAS = [
  { name: 'Madhapur', icon: '🏙️', tint: 'pink' as const },
  { name: 'Secunderabad', icon: '🚆', tint: 'teal' as const },
  { name: 'Gachibowli', icon: '🌆', tint: 'teal' as const },
  { name: 'Banjara Hills', icon: '🏘️', tint: 'pink' as const },
  { name: 'Jubilee Hills', icon: '🏘️', tint: 'pink' as const },
  { name: 'HITEC City', icon: '🏢', tint: 'teal' as const },
  { name: 'Kondapur', icon: '🏙️', tint: 'pink' as const },
  { name: 'Begumpet', icon: '✈️', tint: 'teal' as const },
];
