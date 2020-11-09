import { Flex, Image, Text } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { playSong } from "../actions";
import { AppActions } from "../actions/types";
import { playSongPayload, ThunkResult } from "../types";

interface Props {
  imageUrl: string;
  name: string;
  artist: string;
  year: string;
  url: string;
  source: string;
  playSong: typeof playSong;
}

function SearchResult(props: Props): ReactElement {
  const { imageUrl, name, artist, year, url, playSong, source } = props;
  console.log({ source, url });
  return (
    <Flex
      onClick={() => {
        playSong(source.toUpperCase(), url, props);
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

const mapDispatchToProps = {
  playSong,
};
export default connect(null, mapDispatchToProps)(SearchResult);
