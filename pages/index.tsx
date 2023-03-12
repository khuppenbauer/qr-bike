import { Title } from '@mantine/core';

export default function HomePage() {
  return <Title sx={(theme) => ({ color: theme.fn.primaryColor() })}>Hello World</Title>;
}
