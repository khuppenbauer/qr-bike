import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LinkProps {
  children: React.ReactNode;
  as: string;
  href: string;
  activeClassName?: string;
  partiallyActive?: boolean;
  className?: string;
}

function LinkComponent({
  children,
  as,
  href,
  activeClassName,
  partiallyActive,
  className,
  ...other
}: LinkProps) {
  const internal = /^\/(?!\/)/.test(as);
  const { asPath } = useRouter();
  if (internal) {
    let cssClass = className;
    if ((partiallyActive && asPath.includes(as)) || as === asPath) {
      cssClass = activeClassName;
    }
    return (
      <Link as={as} href={href} className={cssClass} {...other}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...other} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default LinkComponent;
