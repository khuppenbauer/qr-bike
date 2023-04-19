import React from 'react';
import getConfig from 'next/config';
import Forms from '../Form/Form';
import Sections from '../Section/Section';
import Grids from '../Grid/Grid';
import BlockType from '../../../interfaces/block';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

interface ItemsProps {
  items: BlockType[];
  title?: string;
  slug?: string;
}

const components: { [index: string]: any } = {
  Forms,
  Sections,
  Grids,
};

function BlocksComponent({ items, title, slug }: ItemsProps) {
  return (
    <>
      {items.map((block) => {
        const { id, collection, item } = block;
        const componentName = collection.replace(prefix, '');
        const component = componentName[0].toUpperCase() + componentName.slice(1);
        if (!components[component]) {
          return null;
        }
        const BlockComponent = components[component];
        return <BlockComponent key={id} block={item} title={title} slug={slug} />;
      })}
    </>
  );
}

export default BlocksComponent;
