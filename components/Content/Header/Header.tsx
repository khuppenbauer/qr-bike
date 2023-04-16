import React from 'react';
import { TypographyStylesProvider, Title, Text } from '@mantine/core';
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
      {description && (
        <TypographyStylesProvider>
          <Text dangerouslySetInnerHTML={{ __html: description }} />
        </TypographyStylesProvider>
      )}
    </Container>
  );
}

export default HeaderComponent;
