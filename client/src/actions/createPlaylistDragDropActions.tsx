import { Dispatch } from "react";
import { DraggableLocation } from "react-beautiful-dnd";
import { ThunkResult } from "../types";
import {
  ADDTODRAGNDROP,
  AppActions,
  DISCARDPLAYLIST,
  REMOVEFROMDRAGNDROP,
  REORDER,
  SPOTIFY,
  YOUTUBE,
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
  droppableDestination?: DraggableLocation
): ThunkResult<void> {
  return (dispatch: Dispatch<AppActions>, getState) => {
    //Convert the dropable id to the actual source string
    const musicOBJSource = droppableSource.droppableId.includes(SPOTIFY)
      ? SPOTIFY
      : YOUTUBE;
    //Get song items
    const searchResults = getState().songSearchResult[musicOBJSource];

    if (searchResults !== null) {
      const sourceClone = Array.from(searchResults.items);
      const item = sourceClone[droppableSource.index];
      if (!droppableDestination) {
        droppableDestination = {
          index: sourceClone.length - 1,
          droppableId: "",
        };
      }

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

export function removeFromDragNDrop(index: number): AppActions {
  return {
    type: REMOVEFROMDRAGNDROP,
    payload: index,
  };
}
