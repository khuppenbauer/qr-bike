import getConfig from 'next/config';
import Layout from '../components/Layout/Layout';
import Container from '../components/Container/Container';
import Forms from '../components/Content/Form/Form';
import Header from '../components/Content/Header/Header';
import Meta from '../components/Head/Meta';
import { getDirectusClient } from '../lib/directus';
import PageType from '../interfaces/page';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

interface ParamsProps {
  params: {
    slug: string;
  };
}

interface PageProps {
  page: PageType;
}

const components: { [index: string]: any } = {
  Forms,
};

export default function Page({ page }: PageProps) {
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
          return <BlockComponent key={id} block={item} title={title} slug={page.slug} id={id} />;
        })}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }: ParamsProps) {
  const { slug } = params;
  const directus = await getDirectusClient();
  const { data: pages } = await directus.items(`${prefix}pages`).readByQuery({
    fields: [
      '*',
      'blocks.id',
      'blocks.collection',
      'blocks.item.*',
      `blocks.item.fields.${prefix}form_fields_id.*`,
      `blocks.item.integrations.${prefix}form_integrations_id.*`,
      'blocks.item.on_success_redirect.slug',
    ],
    filter: { slug: { _eq: slug } },
  });
  if (!pages || pages.length !== 1) {
    return null;
  }
  return {
    props: {
      page: pages[0],
    },
  };
}

export async function getStaticPaths() {
  const directus = await getDirectusClient();
  const { data: pages } = await directus.items(`${prefix}pages`).readByQuery({
    fields: 'slug',
    filter: { status: { _eq: 'published' } },
    limit: -1,
  });
  if (!pages || pages.length === 0) {
    return null;
  }
  return {
    paths: pages.map((page) => ({
      params: {
        slug: page.slug,
      },
    })),
    fallback: false,
  };
}
