import type Asset from './asset';

type MetaType = {
  title?: string;
  description?: string;
  author?: string;
  icon?: Asset;
  domain?: string;
};

export default MetaType;
