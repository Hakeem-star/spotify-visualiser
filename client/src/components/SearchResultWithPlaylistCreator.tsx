import React, { ReactElement } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  addToDragNDrop,
  reorderDragNDrop,
} from "../actions/createPlaylistDragDropActions";
import { AppState } from "../reducers";
import CreatePlaylist from "./CreatePlaylist";
import SearchResultContainer from "./SearchResultContainer";

export default function SearchResultWithPlaylistCreator(): ReactElement {
  const songSearchResults = useSelector(
    (state: AppState) => state.songSearchResult
  );
  const dispatch = useDispatch();

  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        // dropped outside the list
        if (!destination) {
          return;
          //delete from playlist
        }
        //If it's from the created playlist...reorder
        if (
          source.droppableId === "createPlaylist" &&
          destination.droppableId === "createPlaylist"
        ) {
          dispatch(reorderDragNDrop(source.index, destination.index));
          return;
        }

        //If it is a different column
        if (destination.droppableId === "createPlaylist") {
          dispatch(addToDragNDrop(source, destination));
        }
      }}
    >
      <SearchResultContainer songSearchResults={songSearchResults} />
      <CreatePlaylist />
    </DragDropContext>
  );
}
