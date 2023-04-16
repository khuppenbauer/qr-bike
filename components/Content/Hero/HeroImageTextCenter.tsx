import React from 'react';
import getConfig from 'next/config';
import { Title, Text, Container, Button, Overlay, createStyles, rem } from '@mantine/core';
import Link from '../../Link/Link';
import ItemType from '../../../interfaces/item';

interface BlockProps {
  block: ItemType;
}

const {
  publicRuntimeConfig: { url },
} = getConfig();

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: rem(180),
    paddingBottom: rem(130),
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    [theme.fn.smallerThan('xs')]: {
      paddingTop: rem(80),
      paddingBottom: rem(50),
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: rem(-1),
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: 'center',

    [theme.fn.smallerThan('xs')]: {
      fontSize: theme.fontSizes.md,
      textAlign: 'left',
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    height: rem(42),
    fontSize: theme.fontSizes.md,
    marginLeft: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
      marginLeft: 0,
    },
  },

}));

function HeroImageTextCenterComponent({ block }: BlockProps) {
  const { title, text, image, links } = block;
  const imgSrc = `${url}/assets/${image}?width=1080&quality=80`;
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper} style={{ backgroundImage: `url(${imgSrc})` }}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />
      <div className={classes.inner}>
        {title && <Title className={classes.title}>{title}</Title>}
        {text && (
          <Container size={640}>
            <Text
              size="lg"
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
                  <Button size="lg" className={classes.control} variant="white">
                    {label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroImageTextCenterComponent;
