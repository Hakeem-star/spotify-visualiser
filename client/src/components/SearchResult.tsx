/** @jsx jsx */
import { Flex, Image, Text } from "@chakra-ui/core";
import { css, jsx } from "@emotion/core";
import React, { ReactElement } from "react";
import { Draggable } from "react-beautiful-dnd";
import { connect, useDispatch } from "react-redux";
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
  index: number;
}

export default function SearchResult(props: Props): ReactElement {
  const dispatch = useDispatch();
  const { imageUrl, name, artist, year, url, source } = props;

  return (
    <Flex
      height="200px"
      w="200px"
      onClick={() => {
        dispatch(playSong(source.toUpperCase(), url, props));
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
