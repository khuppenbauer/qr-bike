import React from 'react';
import { createStyles, Title, Text, Button, Container, rem } from '@mantine/core';
import Link from '../../Link/Link';
import ItemType from '../../../interfaces/item';

interface BlockProps {
  block: ItemType;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(40),
    paddingBottom: rem(80),

    [theme.fn.smallerThan('sm')]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],

    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('xs')]: {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    marginLeft: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,
      marginTop: theme.spacing.md,
      marginLeft: 0,
    },
  },
}));

function HeroTextCenterComponent({ block }: BlockProps) {
  const { title, text, links } = block;
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        {title && <Title className={classes.title}>{title}</Title>}
        {text && (
          <Container p={0} size={600}>
            <Text
              size="lg"
              color="dimmed"
              className={classes.description}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </Container>
        )}
        {links && (
          <div className={classes.controls}>
            {links.map((link) => {
              const { type, label, url: linkUrl, page } = link;
              const href = type === 'internal' ? '/[slug]' : linkUrl;
              const as = type === 'internal' ? `/${page?.slug}` : linkUrl;
              if (!as || !href) {
                return null;
              }
              return (
                <Link key={label} as={as} href={href}>
                  <Button className={classes.control} size="lg">
                    {label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}

export default HeroTextCenterComponent;
