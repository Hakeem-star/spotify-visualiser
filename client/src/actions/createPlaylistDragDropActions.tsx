import { Dispatch } from "react";
import { DraggableLocation } from "react-beautiful-dnd";
import { ThunkResult } from "../types";
import {
  ADDTODRAGNDROP,
  AppActions,
  DISCARDPLAYLIST,
  playlistItemType,
  REORDER,
} from "./types";

export function reorderDragNDrop(
  startIndex: number,
  endIndex: number
): ThunkResult<void> {
  return (dispatch) => {
    dispatch({ type: REORDER, payload: { startIndex, endIndex } });
  };
}

export function addToDragNDrop(
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
): ThunkResult<void> {
  return (dispatch: Dispatch<AppActions>, getState) => {
    const musicSource = droppableSource.droppableId.includes("spotify")
      ? "spotify"
      : "youtube";
    //Get song items
    const searchResults = getState().songSearchResult[musicSource];
    // console.log(
    //   musicSource,
    //   droppableSource.droppableId,
    //   getState().songSearchResult
    // );
    if (searchResults !== null) {
      const sourceClone = Array.from(searchResults.items);
      const item: any = sourceClone[droppableSource.index];
      item.source = musicSource;

      dispatch({
        type: ADDTODRAGNDROP,
        payload: { droppableDestination, item },
      });
    }
  };
}
export function discardPlaylist(): AppActions {
  return { type: DISCARDPLAYLIST };
}

// function removeFromDragNDrop(list, startIndex, endIndex) {
//   return (dispatch, getState) => {
//     const searchResults = getState().searchResult;

//     dispatch({ type: "REORDER", payload: { searchResults } });
//   };
// }
