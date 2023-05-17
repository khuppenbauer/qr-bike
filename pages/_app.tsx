import NextApp, { AppProps, AppContext } from 'next/app';
import getConfig from 'next/config';
import { MantineProvider } from '@mantine/core';
import { getDirectusClient } from '../lib/directus';
import { SettingsProvider } from '../context/settings';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

export default function App(props: AppProps & { customTheme: any }) {
  const { Component, pageProps, customTheme } = props;
  const mantineTheme = {
    ...customTheme,
    globalStyles: (theme: any) => ({
      a: {
        color: theme.colors[theme.primaryColor][9],
      },
    }),
  };
  return (
    <SettingsProvider>
      <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </SettingsProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const directus = await getDirectusClient();
  const { data } = await directus.items(`${prefix}settings`).readByQuery({
    fields: ['colorScheme', 'primaryColor'],
  });
  return {
    ...appProps,
    customTheme: data,
  };
};
