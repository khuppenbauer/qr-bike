import React from 'react';
import {
  createStyles,
  Header,
  Container,
  Group,
  Image,
  Burger,
  Paper,
  Transition,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import getConfig from 'next/config';
import { useSettingsContext } from '../../context/settings';
import Link from '../Link/Link';

const HEADER_HEIGHT = rem(60);

const {
  publicRuntimeConfig: { url },
} = getConfig();

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

function PageHeader() {
  const { header } = useSettingsContext();
  const logo = header?.logo || '';
  const mainMenu = header?.mainMenu || [];
  const [opened, { toggle }] = useDisclosure(false);
  const { classes, cx } = useStyles();

  let items: React.ReactNode = null;

  if (mainMenu && mainMenu.length > 0) {
    items = mainMenu.map((menuItem) => {
      const { title, slug } = menuItem;
      return (
        <Link
          key={slug}
          as={`/${slug}`}
          href="/[slug]"
          className={cx(classes.link)}
          activeClassName={cx(classes.link, classes.linkActive)}
          partiallyActive
        >
          {title}
        </Link>
      );
    });
  }

  if (logo === null && items === null) {
    return null;
  }
  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        {logo && (
          <Link key="home" as="/" href="/">
            <Image
              src={`${url}/assets/${logo.id}?height=40&quality=80`}
              width={200}
              height={40}
              alt={logo.title}
            />
          </Link>
        )}
        {items && (
          <>
            <Group spacing={5} className={classes.links}>
              {items}
            </Group>
            <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

            <Transition transition="pop-top-right" duration={200} mounted={opened}>
              {(styles) => (
                <Paper className={classes.dropdown} withBorder style={styles}>
                  {items}
                </Paper>
              )}
            </Transition>
          </>
        )}
      </Container>
    </Header>
  );
}

export default PageHeader;
