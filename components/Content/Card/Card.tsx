import React from 'react';
import getConfig from 'next/config';
import { Text, Image, Card } from '@mantine/core';
import Button from '../Link/Button';
import ItemType from '../../../interfaces/item';

interface ElementProps {
  element: ItemType;
}

const {
  publicRuntimeConfig: { url },
} = getConfig();

function CardComponent({ element }: ElementProps) {
  const { id, title, text, image, links } = element;
  const imgSrc = `${url}/assets/${image}`;
  return (
    <Card key={id} shadow="sm" padding="xl" radius="md" withBorder>
      {image && (
        <Card.Section>
          <Image src={imgSrc} height={240} />
        </Card.Section>
      )}

      {title && (
        <Text weight={500} size="lg" mt="md">
          {title}
        </Text>
      )}

      {text && <Text mt="xs" color="dimmed" size="sm" dangerouslySetInnerHTML={{ __html: text }} />}

      {links && (
        <>
          {links.map((link) => (
            <Button key={link.id} link={link} size="xs" variant="light" fullWidth />
          ))}
        </>
      )}
    </Card>
  );
}

export default CardComponent;
