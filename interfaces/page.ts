import type Block from './block';

type PageType = {
  title?: string;
  description?: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  keywords: [string];
  image: string;
  noIndex: boolean;
  blocks: [Block];
};

export default PageType;
