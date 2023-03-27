import Head from 'next/head';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { umami, umamiSrc },
} = getConfig();

function ScriptsComponent() {
  return (
    <Head>
      {process.env.NODE_ENV === 'production' && umami && (
        <script
          key="umami-script"
          async
          defer
          data-website-id={`${umami}`}
          src={`${umamiSrc}/umami.js`}
        />
      )}
    </Head>
  );
}

export default ScriptsComponent;
