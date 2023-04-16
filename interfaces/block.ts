import type Item from './item';

type BlockType = {
  id: string;
  collection: string;
  item: Item[];
};

export default BlockType;
