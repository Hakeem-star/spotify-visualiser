import { Button } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { playSong } from "../actions";
import { AppState } from "../reducers";
import SearchResult from "./SearchResult";

export default function PlaylistDetail(): ReactElement {
  const { id }: { id: string } = useParams();
  const playlist = useSelector((state: AppState) => state.playlists[id]);
  const dispatch = useDispatch();
  if (playlist) {
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
            console.log(items);
            dispatch(playSong(items));
          }}
        >
          Play!
        </Button>
      </div>
    );
  } else {
    return <div></div>;
  }
}
