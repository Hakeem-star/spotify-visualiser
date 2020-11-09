import { ADDTODRAGNDROP, playlistDragDrop, REORDER } from "../actions/types";
import { remappedSearchResult } from "../types";

const INITIAL_STATE = [] as remappedSearchResult["items"][0][];

export const playlistDragDropReducer = (
  state = INITIAL_STATE,
  action: playlistDragDrop
): remappedSearchResult["items"][0][] => {
  const stateCopy = state.slice();
  switch (action.type) {
    case ADDTODRAGNDROP:
      //Check for duplicates
      if (
        stateCopy.some((val) => {
          return val.url === action.payload.item.url;
        })
      ) {
        return state;
      }
      //Add the new item in the correct part of the array
      stateCopy.splice(
        action.payload.droppableDestination.index,
        0,
        action.payload.item
      );
      return stateCopy;

    case REORDER:
      const [removed] = stateCopy.splice(action.payload.startIndex, 1);
      stateCopy.splice(action.payload.endIndex, 0, removed);

      return stateCopy;
    default:
      return state;
  }
};
