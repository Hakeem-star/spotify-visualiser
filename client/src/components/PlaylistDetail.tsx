import { Button, Flex } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { playSong } from "../actions";
import { PLAYLIST } from "../actions/types";
import { AppState } from "../reducers";
import SearchResult from "./SearchResult";

export default function PlaylistDetail(): ReactElement {
  const { id }: { id: string } = useParams();

  const playlist = useSelector((state: AppState) => state.playlists[id]);
  console.log({ playlist });
  const { name, items } = playlist;
  return (
    <div key={name}>
      {name}

      {items.map((song, index) => {
        return (
          <SearchResult
            context={items}
            key={song.url}
            index={index}
            {...song}
          />
        );
      })}
      <Button
        onClick={() => {
          playSong(items);
        }}
      >
        Play!
      </Button>
    </div>
  );
}
