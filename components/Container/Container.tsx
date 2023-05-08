import React, { ReactNode } from 'react';
import { Container } from '@mantine/core';

interface ContainerProps {
  children: ReactNode;
}

function ContainerComponent({ children }: ContainerProps) {
  return <Container mt={20}>{children}</Container>;
}

export default ContainerComponent;
