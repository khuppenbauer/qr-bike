import React from 'react';
import { Button } from '@mantine/core';
import Link from '../../Link/Link';
import LinkType from '../../../interfaces/link';

interface LinkProps {
  link: LinkType;
  size: string;
  variant: string;
  className?: any;
  fullWidth?: boolean;
}

function ButtonComponent({ link, size, variant, className, fullWidth }: LinkProps) {
  const { type, label, url: linkUrl, page } = link;
  const href = type === 'internal' ? '/[slug]' : linkUrl;
  const as = type === 'internal' ? `/${page?.slug}` : linkUrl;
  if (!as || !href) {
    return null;
  }
  return (
    <Button
      key={link.id}
      className={className}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      component={Link}
      href={href}
      as={as}
    >
      {label}
    </Button>
  );
}

export default ButtonComponent;
