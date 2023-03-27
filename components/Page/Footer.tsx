import React from 'react';
import { createStyles, Container, Group, Text, ActionIcon, rem } from '@mantine/core';
import SVG from 'react-inlinesvg';
import getConfig from 'next/config';
import Image from 'next/image';
import { useSettingsContext } from '../../context/settings';
import Link from '../Link/Link';

const svgBaseUrl = 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/';

const {
  publicRuntimeConfig: { url },
} = getConfig();

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  logo: {
    maxWidth: rem(200),

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  description: {
    marginTop: rem(5),

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  groups: {
    display: 'flex',
    flexWrap: 'wrap',

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  wrapper: {
    width: rem(160),
  },

  link: {
    display: 'block',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: rem(3),
    paddingBottom: rem(3),
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: `calc(${theme.spacing.xs} / 2)`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  borderTop: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },
}));

function PageFooter() {
  const { footer } = useSettingsContext();
  const logo = footer?.logo || null;
  const text = footer?.text || '';
  const links = footer?.links || null;
  const author = footer?.author || '';
  const socialMedia = footer?.socialMedia || null;
  const { classes } = useStyles();

  let socialMediaIcons = null;
  let footerLinks = null;

  if (socialMedia) {
    socialMediaIcons = socialMedia.map((socialMediaItem) => {
      const { brand, url: socialMediaUrl } = socialMediaItem;
      const svg = `${svgBaseUrl}brand-${brand.toLowerCase()}.svg`;
      return (
        <a href={socialMediaUrl} key={brand} target="_blank" rel="noreferrer">
          <ActionIcon size="lg">
            <SVG src={svg} width={18} strokeWidth={1.5} title={brand} />
          </ActionIcon>
        </a>
      );
    });
  }

  if (links && links.length > 0) {
    const linkItems = links.map((linkGroup) => {
      const { title, links: linkGroupArray, id } = linkGroup;
      const linkGroupItems = linkGroupArray.map((link) => {
        const { type, label, url: linkUrl, page } = link;
        const href = type === 'internal' ? '/[slug]' : linkUrl;
        const as = type === 'internal' ? `/${page?.slug}` : linkUrl;
        if (!as || !href) {
          return null;
        }
        return (
          <Link
            key={label}
            as={as}
            href={href}
            className={classes.link}
            activeClassName={classes.link}
          >
            {label}
          </Link>
        );
      });
      if (links.length > 1) {
        return (
          <div className={classes.wrapper} key={id}>
            {title && <Text className={classes.title}>{title}</Text>}
            {linkGroupItems}
          </div>
        );
      }
      return linkGroupItems;
    });
    if (links.length > 1) {
      footerLinks = <div className={classes.groups}>{linkItems}</div>;
    } else {
      footerLinks = <Group className={classes.links}>{linkItems}</Group>;
    }
  }

  const footer1Exists = logo || text || (links && links.length > 0);
  const footer2Exists = author !== null || socialMedia !== null;
  if (!footer1Exists && !footer2Exists) {
    return null;
  }
  const footer2ClassName = footer1Exists
    ? `${classes.afterFooter} ${classes.borderTop}`
    : `${classes.afterFooter}`;
  return (
    <footer className={classes.footer}>
      {footer1Exists && (
        <Container className={classes.inner}>
          <div className={classes.logo}>
            {logo && (
              <Image src={`${url}/assets/${logo.id}`} width={200} height={40} alt={logo.title} />
            )}
            {text && (
              <Text size="xs" color="dimmed" className={classes.description}>
                <div dangerouslySetInnerHTML={{ __html: text }} />
              </Text>
            )}
          </div>
          {footerLinks}
        </Container>
      )}
      {footer2Exists && (
        <Container className={footer2ClassName}>
          {author && (
            <Text color="dimmed" size="sm">
              © {new Date().getFullYear()} {author}
            </Text>
          )}
          {socialMedia && socialMedia.length > 0 && (
            <Group spacing={0} className={classes.social} position="right" noWrap>
              {socialMediaIcons}
            </Group>
          )}
        </Container>
      )}
    </footer>
  );
}

export default PageFooter;
