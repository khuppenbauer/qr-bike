import { Title } from '@mantine/core';
import Layout from '../components/Layout/Layout';
import Container from '../components/Container/Container';

export default function Index() {
  return (
    <Layout>
      <Container>
        <Title sx={(theme) => ({ color: theme.fn.primaryColor() })}>Hello World</Title>
      </Container>
    </Layout>
  );
}
