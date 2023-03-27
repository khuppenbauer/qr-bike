import type Links from './links';
import type Asset from './asset';

type HeaderType = {
  logo?: Asset;
  mainMenu?: {
    title: string;
    slug: string;
  }[];
};

export default HeaderType;
