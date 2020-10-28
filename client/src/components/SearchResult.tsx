import { Flex, Image, Text } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { playSong } from "../actions";

interface Props {
  imageUrl: string;
  name: string;
  artist: string;
  year: string;
  url: string;
}

function SearchResult({
  imageUrl,
  name,
  artist,
  year,
  url,
}: Props): ReactElement {
  return (
    <Flex
      onClick={() => {
        playSong;
        console.log(url);
      }}
    >
      <Image src={imageUrl} alt={name} />
      <Flex>
        <Text>{name}</Text>
        <Text>{artist}</Text>
        <Text>{year}</Text>
      </Flex>
    </Flex>
  );
}
export default connect()(SearchResult);
