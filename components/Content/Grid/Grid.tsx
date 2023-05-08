import React from 'react';
import { createStyles, Badge, Group, Title, Text, SimpleGrid, Container, rem } from '@mantine/core';
import Card from '../Card/Card';
import Button from '../Link/Button';
import { parse } from '../../../lib/helpers';

const components: { [index: string]: any } = {
  card: Card,
};

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
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

function GridsComponent({ block }: any) {
  const { type, subtitle, title, text } = block;
  const { classes } = useStyles();
  const links = parse(block.links);
  const elements = parse(block.elements);
  const cols = elements.length <= 3 ? elements.length : 3;
  const hasHeader = subtitle || title || text || links;
  return (
    <Container size="lg" py="xl">
      {subtitle && (
        <Group position="center">
          <Badge variant="filled" size="lg">
            {subtitle}
          </Badge>
        </Group>
      )}
      {title && (
        <Title order={2} className={classes.title} ta="center" mt="sm">
          {title}
        </Title>
      )}
      {text && (
        <Text
          c="dimmed"
          className={classes.description}
          ta="center"
          mt="md"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {links.length > 0 && (
        <div className={classes.controls}>
          {links.map((link) => (
            <Button
              key={link.id}
              link={link}
              size="lg"
              variant="filled"
              className={classes.control}
            />
          ))}
        </div>
      )}
      <SimpleGrid cols={cols} spacing="xl" mt={`${hasHeader} ? 50 : 0`} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {elements.map((element) => {
          if (!components[type]) {
            return null;
          }
          const ElementComponent = components[type];
          return <ElementComponent key={element.id} element={element} />;
        })}
      </SimpleGrid>
    </Container>
  );
}

export default GridsComponent;
