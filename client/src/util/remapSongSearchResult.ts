import { getPropertyValue } from "./getPropertyValue";
import { remappedSearchResult } from "../types";
//Transforms the result from the Api to an object my components can easily use
export const remapSongSearchResult = (
  source: string,
  arrayOfResults: Record<string, any>,
  next: string,
  previous: string | null,
  items: string,
  imageUrl: string,
  name: string,
  artist: string,
  year: string,
  url: string,
  duration: string
): remappedSearchResult => {
  const obj = {
    next: next ? getPropertyValue(arrayOfResults, next) : "",
    previous: previous ? getPropertyValue(arrayOfResults, previous) : "",
  } as remappedSearchResult;
  obj.items = arrayOfResults[items].map((item: Record<string, any>) => {
    return {
      source,
      imageUrl: getPropertyValue(item, imageUrl),
      name: getPropertyValue(item, name),
      artist: getPropertyValue(item, artist),
      year: getPropertyValue(item, year),
      url: getPropertyValue(item, url),
      duration: getPropertyValue(item, duration),
    };
  });
  return obj;
};
