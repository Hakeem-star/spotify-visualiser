/** @jsx jsx */
import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
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
  const { imageUrl, name, artist, duration, url, index } = props;
  console.log({ imageUrl });
  return (
    <Tooltip label={name}>
      <Flex
        position="relative"
        height="95px"
        color="white"
        w="100%"
        borderRadius="5px"
        overflow="hidden"
        onClick={() => {
          console.log(url);
          dispatch(playSong(props.context, index));
        }}
      >
        <Image
          position="absolute"
          top={0}
          left={0}
          width="100%"
          transform="translateY(-25%)"
          transition="opacity 0.1s"
          opacity={imageLoaded}
          onLoad={() => setImageLoaded(1)}
          // maxW="124px"
          src={imageUrl[0].url}
          fit="contain"
          alt={name}
        />

        <Flex
          justifyContent="center"
          fontSize="0.8em"
          flexDirection="column"
          p="5px"
          w="50%"
          flex="1"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgb(84 84 84 / 0%) 0%, rgb(0 0 0) 0%, rgb(33 33 33 / 40%) 100%)",
          }}
          zIndex={1}
          // style={{ mixBlendMode: "luminosity" }}
        >
          <Flex alignItems="center" h="50%">
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              // textShadow="0.5px 0 0 #f00, 0 -0.5px 0 #ff5e00, 0 0.5px 0 #f00, -0.5px 0 0 #ff6a00"
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
            <Text>{duration}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Tooltip>
  );
}
