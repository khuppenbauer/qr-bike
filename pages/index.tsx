import getConfig from 'next/config';
import Layout from '../components/Layout/Layout';
import Meta from '../components/Head/Meta';
import Header from '../components/Content/Header/Header';
import Container from '../components/Container/Container';
import Forms from '../components/Content/Form/Form';
import { getDirectusClient } from '../lib/directus';
import PageType from '../interfaces/page';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

interface PageProps {
  page: PageType;
}

const components: { [index: string]: any } = {
  Forms,
};

export default function Index({ page }: PageProps) {
  const title = page.title || '';
  const description = page.description || '';
  const { seoTitle, seoDescription, keywords, image, noIndex } = page;
  return (
    <Layout>
      <Meta title={title} seo={{ seoTitle, seoDescription, keywords, image, noIndex }} />
      <Container>
        <Header headline={title} description={description} />
        {page.blocks.map((block) => {
          const { id, collection, item } = block;
          const componentName = collection.replace(prefix, '');
          const component = componentName[0].toUpperCase() + componentName.slice(1);
          if (!components[component]) {
            return null;
          }
          const BlockComponent = components[component];
          return <BlockComponent key={id} block={item} title={title} slug={page.slug} />;
        })}
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const directus = await getDirectusClient();
  const { data } = await directus.items(`${prefix}settings`).readByQuery({
    fields: [
      'root.*',
      'root.blocks.id',
      'root.blocks.collection',
      'root.blocks.item.*',
      `root.blocks.item.fields.${prefix}form_fields_id.*`,
      'root.blocks.item.on_success_redirect.slug',
    ],
  });
  const { root: page }: any = data;
  if (!page) {
    return null;
  }
  return {
    props: {
      page,
    },
  };
}
