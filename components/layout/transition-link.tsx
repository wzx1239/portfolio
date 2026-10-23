'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect, type ComponentProps, type MouseEvent } from 'react';

let pendingNavigation: { target?: string; complete: () => void } | undefined;
export function NavigationTransitionComplete() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (!pendingNavigation) return;
    const pending = pendingNavigation;
    const finish = () => {
      if (pendingNavigation !== pending) return true;
      if (pending.target && !document.querySelector(`[data-transition-target="${pending.target}"]`)) return false;
      window.scrollTo({ top: 0, behavior: 'instant' });
      pending.complete();
      return true;
    };
    if (finish()) return;
    // A cold route can commit its loading boundary before its hero arrives.
    const observer = new MutationObserver(() => { if (finish()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

type Props = ComponentProps<typeof Link> & { transitionName?: string };
export function TransitionLink({ transitionName, onClick, children, ...props }: Props) {
  const router = useRouter();
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === '1') {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;
      // Pages serves exported HTML, without the App Router's runtime transport.
      // Use the rendered anchor URL: Next already added basePath/trailingSlash.
      event.preventDefault();
      window.location.assign(event.currentTarget.href);
      return;
    }
    const href = props.href.toString();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    const image = event.currentTarget.querySelector<HTMLElement>('[data-transition-media]');
    if (image && transitionName) image.style.viewTransitionName = transitionName;
    const transition = document.startViewTransition(() => new Promise<void>(resolve => {
      const timer = window.setTimeout(() => { pendingNavigation = undefined; resolve(); }, 900);
      pendingNavigation = { target: transitionName, complete: () => { window.clearTimeout(timer); pendingNavigation = undefined; resolve(); } };
      router.push(href, { scroll: true });
    }));
    void transition.finished.catch(() => {}).finally(() => { if (image) image.style.viewTransitionName = ''; });
  }
  return <Link {...props} prefetch={process.env.NEXT_PUBLIC_STATIC_EXPORT === '1' ? false : props.prefetch} onClick={navigate}>{children}</Link>;
}
