import React from 'react';
import getConfig from 'next/config';
import {
  useMantineTheme,
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  rem,
} from '@mantine/core';
import Link from '../../Link/Link';
import ItemType from '../../../interfaces/item';

interface BlockProps {
  block: ItemType;
}

const {
  publicRuntimeConfig: { url },
} = getConfig();

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginLeft: 0,
    },
  },

  title: {
    color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },
}));

function TextImageLeftComponent({ block }: BlockProps) {
  const { title, text, image, links } = block;
  const imgSrc = `${url}/assets/${image}`;
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const contentStyle = image
    ? {
        maxWidth: rem(480),
        marginLeft: `calc(${theme.spacing.xl} * 3)`,
      }
    : {};

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          {image && <Image src={imgSrc} className={classes.image} />}
          <div className={classes.content} style={contentStyle}>
            {title && <Title className={classes.title}>{title}</Title>}
            {text && <Text color="dimmed" mt="md" dangerouslySetInnerHTML={{ __html: text }} />}
            {links && (
              <Group mt={30}>
                {links.map((link) => {
                  const { type, label, url: linkUrl, page } = link;
                  const href = type === 'internal' ? '/[slug]' : linkUrl;
                  const as = type === 'internal' ? `/${page?.slug}` : linkUrl;
                  if (!as || !href) {
                    return null;
                  }
                  return (
                    <Link key={label} as={as} href={href}>
                      <Button size="md" className={classes.control}>
                        {label}
                      </Button>
                    </Link>
                  );
                })}
              </Group>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TextImageLeftComponent;
