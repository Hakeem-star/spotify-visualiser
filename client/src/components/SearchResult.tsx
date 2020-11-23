/** @jsx jsx */
import { Flex, Image, Text } from "@chakra-ui/core";
import { css, jsx } from "@emotion/core";
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
      height="200px"
      w="200px"
      onClick={() => {
        console.log(url);
        dispatch(playSong(props.context, index));
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
