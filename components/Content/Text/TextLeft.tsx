import React from 'react';
import {
  createStyles,
  Container,
  Title,
  Group,
  Text,
  rem,
} from '@mantine/core';
import Button from '../Link/Button';
import ItemType from '../../../interfaces/item';

interface BlockProps {
  block: ItemType;
}

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
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
}));

function TextLeftComponent({ block }: BlockProps) {
  const { title, text, links } = block;
  const { classes } = useStyles();

  return (
    <Container py="xl">
      <div className={classes.inner}>
        <div className={classes.content}>
          {title && <Title className={classes.title}>{title}</Title>}
          {text && <Text mt="md" dangerouslySetInnerHTML={{ __html: text }} />}
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
      </div>
    </Container>
  );
}

export default TextLeftComponent;
