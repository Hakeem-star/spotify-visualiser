/** @jsx jsx */
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { css, jsx } from "@emotion/react";
import { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { playSong } from "../actions";
import { playlistItemSongsType } from "../actions/types";

interface Props extends playlistItemSongsType {
  index?: number;
  context: playlistItemSongsType[];
}

export default function SearchResult(props: Props): ReactElement {
  const dispatch = useDispatch();
  const { imageUrl, name, artist, year, url, index } = props;

  return (
    <Flex
      border="1px solid #0004A3"
      height="95px"
      mb="20px"
      onClick={() => {
        console.log(url);
        dispatch(playSong(props.context, index));
      }}
    >
      <Image maxW="124px" src={imageUrl} fit="contain" alt={name} />
      <Flex
        justifyContent="center"
        fontSize="0.8em"
        flexDirection="column"
        p="5px"
      >
        <Flex alignItems="center" h="50%">
          <Text>{name}</Text>
        </Flex>
        <Flex flexDirection="column" h="50%">
          <Text>{artist}</Text>
          <Text>{year}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
