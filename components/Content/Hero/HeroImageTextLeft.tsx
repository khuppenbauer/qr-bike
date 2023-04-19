import React from 'react';
import getConfig from 'next/config';
import { createStyles, Container, Title, Text, Group, rem } from '@mantine/core';
import Button from '../Link/Button';
import ItemType from '../../../interfaces/item';

interface BlockProps {
  block: ItemType;
}

const {
  publicRuntimeConfig: { url },
} = getConfig();

const useStyles = createStyles((theme) => ({
  root: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: `calc(${theme.spacing.xl} * 3)`,
    paddingBottom: `calc(${theme.spacing.xl} * 3)`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('md')]: {
      flexDirection: 'column',
    },
  },

  image: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  content: {
    padding: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor: 'hsla(0,0%,50%,0.5)',

    [theme.fn.smallerThan('md')]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: rem(500),
    fontSize: rem(48),

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: rem(34),
      lineHeight: 1.15,
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    maxWidth: rem(500),

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
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

function HeroImageTextLeftComponent({ block }: BlockProps) {
  const { title, text, image, links } = block;
  const imgSrc = `${url}/assets/${image}?width=1080&quality=80`;
  const { classes } = useStyles();
  return (
    <div className={classes.root} style={{ backgroundImage: `url(${imgSrc})` }}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            {title && <Title className={classes.title}>{title}</Title>}
            {text && (
              <Text
                mt={30}
                className={classes.description}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
            {links && (
              <Group className={classes.controls}>
                {links.map((link) => (
                  <Button
                    key={link.id}
                    link={link}
                    size="xl"
                    variant="white"
                    className={classes.control}
                  />
                ))}
              </Group>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default HeroImageTextLeftComponent;
