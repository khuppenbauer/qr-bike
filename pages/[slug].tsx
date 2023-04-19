import getConfig from 'next/config';
import Layout from '../components/Layout/Layout';
import Blocks from '../components/Content/Blocks/Blocks';
import Header from '../components/Content/Header/Header';
import Manifest from '../components/Head/Manifest';
import Meta from '../components/Head/Meta';
import { useSettingsContext } from '../context/settings';
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

export default function Page({ page }: PageProps) {
  const title = page.title || '';
  const description = page.description || '';
  const { pwa } = useSettingsContext();
  const { headline, blocks, slug, seoTitle, seoDescription, keywords, image, noIndex } = page;
  return (
    <Layout>
      {pwa && <Manifest />}
      <Meta title={title} seo={{ seoTitle, seoDescription, keywords, image, noIndex }} />
      <Header headline={headline} description={description} />
      <Blocks items={blocks} title={title} slug={slug} />
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
      `blocks.item.elements.${prefix}elements_id.*`,
      `blocks.item.elements.${prefix}elements_id.links.${prefix}links_id.*`,
      `blocks.item.links.${prefix}links_id.*`,
      `blocks.item.fields.${prefix}form_fields_id.*`,
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
