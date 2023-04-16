import Head from 'next/head';
import getConfig from 'next/config';
import { useSettingsContext } from '../../context/settings';

const {
  publicRuntimeConfig: { url },
} = getConfig();

function ManifestComponent() {
  const { manifest } = useSettingsContext();
  const theme_color = manifest?.theme_color || '#ffffff';
  let icon;
  if (manifest?.icon?.id) {
    icon = `${url}/assets/${manifest.icon.id}?width=192`;
  }
  return (
    <Head>
      <link rel="manifest" href="/manifest.json" />
      {icon && <link rel="apple-touch-icon" href={icon} />}
      <meta name="theme-color" content={theme_color} />
    </Head>
  );
}

export default ManifestComponent;
