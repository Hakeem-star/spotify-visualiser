import { getPropertyValue } from "./getPropertyValue";
//Transforms the result from the Api to an object my components can easily use
export const remapSongSearchResult = (
  arrayOfResults: Record<string, any>,
  next: string,
  previous: string,
  items: string,
  imageUrl: string,
  name: string,
  artist: string,
  year: string
): {
  next: string;
  previous: string;
  items?: [] | undefined;
} => {
  const obj: { next: string; previous: string; items?: [] } = {
    next: next ? getPropertyValue(arrayOfResults, next) : "",
    previous: previous ? getPropertyValue(arrayOfResults, previous) : "",
  };
  obj.items = arrayOfResults[items].map((item: Record<string, any>) => {
    return {
      imageUrl: getPropertyValue(item, imageUrl),
      name: getPropertyValue(item, name),
      artist: getPropertyValue(item, artist),
      year: getPropertyValue(item, year),
    };
  });
  return obj;
};
