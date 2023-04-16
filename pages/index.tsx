import getConfig from 'next/config';
import Layout from '../components/Layout/Layout';
import Manifest from '../components/Head/Manifest';
import Meta from '../components/Head/Meta';
import Header from '../components/Content/Header/Header';
import Blocks from '../components/Content/Blocks/Blocks';
import { getDirectusClient } from '../lib/directus';
import PageType from '../interfaces/page';
import { useSettingsContext } from '../context/settings';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

interface PageProps {
  page: PageType;
}

export default function Index({ page }: PageProps) {
  const title = page.title || '';
  const description = page.description || '';
  const { headline, blocks, seoTitle, seoDescription, keywords, image, noIndex } = page;
  const { pwa } = useSettingsContext();
  return (
    <Layout>
      {pwa && <Manifest />}
      <Meta title={title} seo={{ seoTitle, seoDescription, keywords, image, noIndex }} />
      <Header headline={headline} description={description} />
      <Blocks items={blocks} />
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
      `root.blocks.item.links.${prefix}links_id.*`,
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
