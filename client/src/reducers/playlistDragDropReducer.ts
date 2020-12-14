import {
  ADDTODRAGNDROP,
  DISCARDPLAYLIST,
  editPlaylist,
  EDITPLAYLIST,
  playlistDragDrop,
  playlistItemType,
  REMOVEFROMDRAGNDROP,
  REORDER,
} from "../actions/types";

const INITIAL_STATE = {
  name: "",
  id: undefined,
  items: [],
} as playlistItemType;

export const playlistDragDropReducer = (
  state = INITIAL_STATE,
  action: playlistDragDrop | editPlaylist
): playlistItemType => {
  const stateCopy = state.items.slice();
  switch (action.type) {
    case ADDTODRAGNDROP:
      //Check for duplicates
      if (
        state.items.some((val) => {
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
      return { ...state, items: stateCopy };

    case REORDER:
      //Assign first in array to "remove" variable
      const [removed] = stateCopy.splice(action.payload.startIndex, 1);
      stateCopy.splice(action.payload.endIndex, 0, removed);
      return { ...state, items: stateCopy };

    case REMOVEFROMDRAGNDROP:
      return {
        ...state,
        items: state.items.filter((val, index) => index !== action.payload),
      };

    case EDITPLAYLIST:
      return action.payload;

    case DISCARDPLAYLIST:
      return INITIAL_STATE;

    default:
      return state;
  }
};