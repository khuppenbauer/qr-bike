import type Links from './links';
import type Asset from './asset';

type FooterType = {
  logo?: Asset;
  text?: string;
  links?: Links[];
  socialMedia?: {
    brand: string;
    url: string;
  }[];
  author?: string;
};

export default FooterType;
