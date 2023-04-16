import Head from 'next/head';
import getConfig from 'next/config';
import { useSettingsContext } from '../../context/settings';

const {
  publicRuntimeConfig: { url },
} = getConfig();

interface MetaProps {
  title?: string;
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    author?: string;
    keywords?: [string];
    image?: string;
    noIndex?: boolean;
  };
}

function MetaComponent({ title, seo }: MetaProps) {
  const { meta } = useSettingsContext();
  const { seoTitle, seoDescription, keywords, image, noIndex } = seo || {};
  let pageTitle = seoTitle || title;

  const settingsTitle = meta?.title || '';
  const settingsDescription = meta?.description || '';
  const author = meta?.author;

  const icon = meta?.icon?.id;
  if (settingsTitle) {
    pageTitle = `${settingsTitle} - ${pageTitle}`;
  }
  const metaDescription = seoDescription || settingsDescription;
  const metaAuthor = author;
  const imageHandle = image ? `${url}/assets/${image}` : null;
  return (
    <Head>
      <title>{pageTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {imageHandle && <meta property="image" content={imageHandle} />}
      {metaAuthor && <meta name="author" content={metaAuthor} />}
      {noIndex && (
        <meta name="robots" content="noindex, nofollow, noimageindex" data-no-index="true" />
      )}

      <meta name="og:type" content="website" />
      <meta name="og:title" content={pageTitle} />
      {metaDescription && <meta name="og:description" content={metaDescription} />}
      {imageHandle && <meta property="og:image" content={imageHandle} />}
      {metaAuthor && <meta name="og:author" content={metaAuthor} />}

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {imageHandle && <meta property="twitter:image" content={imageHandle} />}
      {metaAuthor && <meta name="twitter:author" content={metaAuthor} />}
      {icon && (
        <>
          <link
            rel="icon"
            type={meta?.icon?.type}
            sizes="16x16"
            href={`${url}/assets/${icon}?width=16`}
          />
          <link
            rel="icon"
            type={meta?.icon?.type}
            sizes="32x32"
            href={`${url}/assets/${icon}?width=32`}
          />
        </>
      )}
    </Head>
  );
}

export default MetaComponent;
