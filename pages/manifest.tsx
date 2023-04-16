import fs from 'fs';
import fetch from 'node-fetch';
import getConfig from 'next/config';
import { getDirectusClient } from '../lib/directus';

const {
  publicRuntimeConfig: { prefix, url },
} = getConfig();

const iconsFolder = 'icons';

interface IconProps {
  src: string;
  sizes: string;
  type: string;
}

interface ManifestProps {
  name: string;
  description: string;
  short_name: string;
  theme_color: string;
  background_color: string;
  display: string;
  orientation: string;
  scope: string;
  start_url: string;
  icons: IconProps[];
  splash_pages: null;
}

export default function Index() {
  return null;
}

const getManifestProps = async () => {
  const directus = await getDirectusClient();
  const { data } = await directus.items(`${prefix}settings`).readByQuery({
    fields: [
      'title',
      'description',
      'short_name',
      'theme_color',
      'background_color',
      'display',
      'scope',
      'start_url',
      'icon.id',
      'icon.type',
    ],
  });
  return data;
};

const getIcons = async (icon: { id: string; type: string }) => {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const icons: IconProps | any[] = [];
  if (!fs.existsSync(`./public/${iconsFolder}`)) {
    fs.mkdirSync(`./public/${iconsFolder}`);
  }
  if (icon?.id) {
    await Promise.all(
      sizes.map(async (size) => {
        const src = `${url}/assets/${icon.id}?width=${size}`;
        const path = `${iconsFolder}/icon-${size}x${size}.jpg`;
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(`./public/${path}`, buffer);
        icons.push({
          src: path,
          sizes: `${size}x${size}`,
          type: `${icon.type}`,
        });
      })
    );
  }
  return icons;
};

const getManifest = async () => {
  const manifest: any = await getManifestProps();
  const {
    title,
    short_name,
    description,
    theme_color,
    background_color,
    display,
    scope,
    start_url,
    icon,
  } = manifest;

  const icons = await getIcons(icon);
  const manifestTemplate: ManifestProps = {
    name: title || '',
    description: description || '',
    short_name: short_name || '',
    theme_color: theme_color || '#ffffff',
    background_color: background_color || '#ffffff',
    display: display || 'fullscreen',
    orientation: 'portrait',
    scope: scope || '/',
    start_url: start_url || '/',
    icons,
    splash_pages: null,
  };
  return manifestTemplate;
};

export async function getStaticProps() {
  const manifest = await getManifest();
  fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 2));
  return {
    props: {},
  };
}
