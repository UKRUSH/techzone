"use client";

import Link from "next/link";
import { memo } from "react";

// Thin wrapper — Next.js Link already handles prefetch and instant navigation.
// The old overlay added a 500 ms blocking full-screen blur on every click.
export const FastLink = memo(function FastLink({
  href,
  children,
  className,
  showLoader,
  prefetch = true,
  ...props
}) {
  return (
    <Link href={href} className={className} prefetch={prefetch} {...props}>
      {children}
    </Link>
  );
});

// Next.js App Router does not expose route-change events for a progress bar.
// These components are kept as no-ops to avoid import errors elsewhere.
export const NavigationProgress = memo(function NavigationProgress() {
  return null;
});

// Next.js <Link prefetch> already prefetches on hover/viewport — no manual DOM
// manipulation needed. Staggered setTimeout injection was delaying startup.
export const RoutePrefetcher = memo(function RoutePrefetcher() {
  return null;
});
