import { Flex, Image, Text } from "@chakra-ui/core";
import React, { ReactElement } from "react";

interface Props {
  imageUrl: string;
  name: string;
  artist: string;
  year: string;
}

export default function SearchResult({
  imageUrl,
  name,
  artist,
  year,
}: Props): ReactElement {
  return (
    <Flex>
      <Image src={imageUrl} alt={name} />
      <Flex>
        <Text>{name}</Text>
        <Text>{artist}</Text>
        <Text>{year}</Text>
      </Flex>
    </Flex>
  );
}
