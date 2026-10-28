'use client';
import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

type Props = ComponentProps<typeof Link> & { transitionName?: string };
// The persistent Trace layer owns transitions for all internal links. Keep the
// static-export full-document fallback when that listener has not intercepted.
export function TransitionLink({ transitionName: _transitionName, onClick, children, ...props }: Props) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT !== '1' || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;
    event.preventDefault();
    window.location.assign(event.currentTarget.href);
  }
  return <Link {...props} prefetch={process.env.NEXT_PUBLIC_STATIC_EXPORT==='1'?false:props.prefetch} onClick={navigate}>{children}</Link>;
}
