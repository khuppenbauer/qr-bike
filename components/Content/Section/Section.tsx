import React from 'react';
import { parse } from '../../../lib/helpers';
import HeroImageTextCenterComponent from '../Hero/HeroImageTextCenter';
import HeroImageTextLeftComponent from '../Hero/HeroImageTextLeft';
import HeroTextCenterComponent from '../Hero/HeroTextCenter';
import HeroTextLeftComponent from '../Hero/HeroTextLeft';
import TextImageLeftComponent from '../Text/TextImageLeft';
import TextImageRightComponent from '../Text/TextImageRight';
import TextLeftComponent from '../Text/TextLeft';

const components: { [index: string]: any } = {
  hero_text_left: HeroTextLeftComponent,
  hero_text_center: HeroTextCenterComponent,
  hero_text_left_image: HeroImageTextLeftComponent,
  hero_text_center_image: HeroImageTextCenterComponent,
  text_image_left: TextImageLeftComponent,
  text_image_right: TextImageRightComponent,
  text_text_left: TextLeftComponent,
};

function SectionsComponent({ block }: any) {
  const { type, layout, image } = block;
  const links = parse(block.links);
  const blockItem = {
    ...block,
    links,
  };
  let component = `${type}_${layout}`;
  if (type === 'hero' && image) {
    component = `${type}_${layout}_image`;
  }
  if (!components[component]) {
    return null;
  }
  const BlockComponent = components[component];
  return <BlockComponent block={blockItem} />;
}

export default SectionsComponent;
