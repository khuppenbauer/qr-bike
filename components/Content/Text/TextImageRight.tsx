import React from 'react';
import getConfig from 'next/config';
import { createStyles, Image, Container, Title, Group, Text, rem } from '@mantine/core';
import Button from '../Link/Button';
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
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
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

function TextImageRightComponent({ block }: BlockProps) {
  const { title, text, image, links } = block;
  const imgSrc = `${url}/assets/${image}`;
  const { classes } = useStyles();
  const contentStyle = image ? { maxWidth: rem(480) } : {};

  return (
    <Container>
      <div className={classes.inner}>
        <div className={classes.content} style={contentStyle}>
          {title && <Title className={classes.title}>{title}</Title>}
          {text && <Text color="dimmed" mt="md" dangerouslySetInnerHTML={{ __html: text }} />}
          {links && (
            <Group mt={30}>
              {links.map((link) => (
                <Button
                  key={link.id}
                  link={link}
                  size="md"
                  variant="filled"
                  className={classes.control}
                />
              ))}
            </Group>
          )}
        </div>
        {image && <Image src={imgSrc} className={classes.image} />}
      </div>
    </Container>
  );
}

export default TextImageRightComponent;
