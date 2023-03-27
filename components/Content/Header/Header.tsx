import React from 'react';
import { TypographyStylesProvider, Title, Text } from '@mantine/core';

interface HeaderProps {
  headline?: string;
  description?: string;
}

function HeaderComponent({ headline, description }: HeaderProps) {
  return (
    <>
      {headline && <Title sx={(theme) => ({ color: theme.fn.primaryColor() })}>{headline}</Title>}
      {description && (
        <TypographyStylesProvider>
          <Text dangerouslySetInnerHTML={{ __html: description }} />
        </TypographyStylesProvider>
      )}
    </>
  );
}

export default HeaderComponent;
