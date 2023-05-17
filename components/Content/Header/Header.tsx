import React from 'react';
import { Title, Text } from '@mantine/core';
import Container from '../../Container/Container';

interface HeaderProps {
  headline?: string;
  description?: string;
}

function HeaderComponent({ headline, description }: HeaderProps) {
  if (!headline && !description) {
    return null;
  }
  return (
    <Container>
      {headline && <Title sx={(theme) => ({ color: theme.fn.primaryColor() })}>{headline}</Title>}
      {description && <Text dangerouslySetInnerHTML={{ __html: description }} />}
    </Container>
  );
}

export default HeaderComponent;
