import React, { ReactNode } from 'react';
import PageFooter from '../Page/Footer';
import PageHeader from '../Page/Header';
import Scripts from '../Head/Scripts';

interface LayoutProps {
  children: ReactNode;
}

function LayoutComponent({ children }: LayoutProps) {
  return (
    <>
      <Scripts />
      <PageHeader />
      <main>{children}</main>
      <PageFooter />
    </>
  );
}

export default LayoutComponent;
