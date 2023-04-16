import React from 'react';
import { createStyles, Container, Text, Button, Group, rem } from '@mantine/core';
import Link from '../../Link/Link';
import ItemType from '../../../interfaces/item';

interface BlockProps {
  block: ItemType;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    position: 'relative',
    paddingTop: rem(40),
    paddingBottom: rem(120),

    [theme.fn.smallerThan('sm')]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan('sm')]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },
}));

function HeroTextLeftComponent({ block }: BlockProps) {
  const { title, text, links } = block;
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        {title && <h1 className={classes.title}>{title}</h1>}
        {text && (
          <Text
            className={classes.description}
            color="dimmed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}

        {links && (
          <Group className={classes.controls}>
            {links.map((link) => {
              const { type, label, url: linkUrl, page } = link;
              const href = type === 'internal' ? '/[slug]' : linkUrl;
              const as = type === 'internal' ? `/${page?.slug}` : linkUrl;
              if (!as || !href) {
                return null;
              }
              return (
                <Link key={label} as={as} href={href}>
                  <Button size="xl" className={classes.control}>
                    {label}
                  </Button>
                </Link>
              );
            })}
          </Group>
        )}
      </Container>
    </div>
  );
}

export default HeroTextLeftComponent;
