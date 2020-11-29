/** @jsx jsx */
import { Flex, Image, Text } from "@chakra-ui/react";
import { css, jsx } from "@emotion/react";
import { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { playSong } from "../actions";
import { playlistItemSongsType } from "../actions/types";

interface Props extends playlistItemSongsType {
  index?: number;
  context: playlistItemSongsType[];
}

export default function SearchResult(props: Props): ReactElement {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(0);
  const { imageUrl, name, artist, year, url, index } = props;

  return (
    <Flex
      height="95px"
      background="#0004A3"
      color="white"
      w="100%"
      borderRadius="5px"
      overflow="hidden"
      onClick={() => {
        console.log(url);
        dispatch(playSong(props.context, index));
      }}
    >
      <div
        css={css`
          width: 124px;
        `}
      >
        <Image
          transition="opacity 0.1s"
          opacity={imageLoaded}
          onLoad={() => setImageLoaded(1)}
          maxW="124px"
          src={imageUrl}
          fit="contain"
          alt={name}
        />
      </div>
      <Flex
        justifyContent="center"
        fontSize="0.8em"
        flexDirection="column"
        p="5px"
        w="50%"
        flex="1"
      >
        <Flex alignItems="center" h="50%">
          <Text
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            css={css`
              // This needs to be animated to move the text so we can read the entire name
              // text-indent: 1rem;
            `}
          >
            {name}
          </Text>
        </Flex>
        <Flex flexDirection="column" h="50%">
          <Text>{artist}</Text>
          <Text>{year}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
