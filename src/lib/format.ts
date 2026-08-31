// Brand style uses "Rs 99", not "₹99" — see the reference mockups
// (rero_home_pink_teal_final.html / rero_become_a_host_page.html).
export function formatPrice(amount: number): string {
  return `Rs ${amount}`;
}
