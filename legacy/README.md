# Retired storefront (reference only)

This folder holds the former "Noir Repair" haircare storefront: cart, checkout,
customer sign-in/registration (NextAuth + Supabase Auth), the order API and
their components. It was retired in October 2026 because Elenor does not sell
online — the live brand states "We do not list prices, and we are not selling
here" — and because the checkout simulated a Stripe payment that never existed.

Nothing here is built, type-checked, linted or deployed (`legacy` is excluded
in `tsconfig.json` and `eslint.config.mjs`). The old URLs (`/cart`,
`/checkout`, `/auth/*`) redirect to live pages via `next.config.ts`.

The files were moved with `git mv`, so their history is intact. If online sales
become a real requirement, rebuild checkout around a proper payment provider
with server-side price validation rather than restoring this code as-is.
Delete this folder once it is no longer needed.
