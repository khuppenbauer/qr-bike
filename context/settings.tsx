import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import getConfig from 'next/config';
import { getDirectusClient } from '../lib/directus';
import LinksType from '../interfaces/links';
import MetaType from '../interfaces/meta';
import HeaderType from '../interfaces/header';
import FooterType from '../interfaces/footer';
import AssetType from '../interfaces/asset';

const {
  publicRuntimeConfig: { prefix },
} = getConfig();

interface SettingsProps {
  headerLogo?: AssetType;
  mainMenu?: {
    title: string;
    slug: string;
  }[];
  footerLogo?: AssetType;
  footerText?: string;
  footerLinks?: LinksType[];
  socialMedia?: {
    brand: string;
    url: string;
  }[];
  author?: string;
  title?: string;
  description?: string;
  icon?: AssetType;
  domain?: string;
  pwa?: boolean;
  theme_color?: string;
}

interface StateProps {
  meta?: MetaType;
  header?: HeaderType;
  footer?: FooterType;
  pwa?: boolean;
  manifest?: {
    icon?: AssetType;
    theme_color?: string;
  };
}

interface SettingsProviderProps {
  children: ReactNode;
}

const SettingsContext = createContext<StateProps>({});

const parse = (data: any[]) => {
  return data.map((item) => {
    const itemData: any = Object.values(item)[0];
    Object.values(itemData).forEach((itemValue, itemKey) => {
      if (Array.isArray(itemValue)) {
        const property = Object.keys(itemData)[itemKey];
        itemData[property] = parse(itemValue);
      }
    });
    return itemData as SettingsProps;
  });
};

const loadSettings = async (): Promise<SettingsProps> => {
  const directus = await getDirectusClient();
  const { data } = await directus.items(`${prefix}settings`).readByQuery({
    fields: [
      '*',
      'icon.id',
      'icon.type',
      'headerLogo.id',
      'headerLogo.title',
      'footerLogo.id',
      'footerLogo.title',
      `footerLinks.${prefix}links_block_id.id`,
      `footerLinks.${prefix}links_block_id.title`,
      `footerLinks.${prefix}links_block_id.links.${prefix}links_id.type`,
      `footerLinks.${prefix}links_block_id.links.${prefix}links_id.label`,
      `footerLinks.${prefix}links_block_id.links.${prefix}links_id.page.slug`,
      `footerLinks.${prefix}links_block_id.links.${prefix}links_id.url`,
      `mainMenu.${prefix}pages_id.title`,
      `mainMenu.${prefix}pages_id.slug`,
    ],
  });
  let { mainMenu, footerLinks }: any = data;
  if (mainMenu) {
    mainMenu = parse(mainMenu);
  }
  if (footerLinks) {
    footerLinks = parse(footerLinks);
  }

  return {
    ...data,
    mainMenu,
    footerLinks,
  };
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsProps>({});
  useEffect(() => {
    loadSettings().then((settings) => {
      setSettings(settings);
    });
  }, []);

  const {
    author,
    title,
    description,
    icon,
    domain,
    mainMenu,
    headerLogo,
    footerLogo,
    footerLinks,
    footerText,
    socialMedia,
    pwa,
    theme_color,
  } = settings;

  const state = {
    meta: {
      author,
      title,
      description,
      icon,
      domain,
    },
    header: {
      logo: headerLogo,
      mainMenu: mainMenu,
    },
    footer: {
      logo: footerLogo,
      links: footerLinks,
      text: footerText,
      author,
      socialMedia,
    },
    pwa,
    manifest: {
      icon,
      theme_color,
    },
  };
  return <SettingsContext.Provider value={state}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
