import React from 'react';
import { Title } from '@mantine/core';
import Container from '../../Container/Container';

function HeaderComponent() {
  return (
    <Container>
      <Title sx={(theme) => ({ color: theme.fn.primaryColor() })}>Not found</Title>
    </Container>
  );
}

export default HeaderComponent;
