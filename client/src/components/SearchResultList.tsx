import { Divider, Flex, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { remappedSearchResult } from "../types";
import DraggableSearchResult from "./DraggableSearchResult";
import SearchResult from "./SearchResult";

const insertIntoArray = (arr: any[], value: any) => {
  return arr.reduce((result, element, index, array) => {
    result.push(element);

    if (index < array.length - 1) {
      result.push(value);
    }

    return result;
  }, []);
};

interface Props {
  source: string;
  items: remappedSearchResult["items"];
}

export default function SearchResultList({
  source,
  items,
}: Props): ReactElement {
  return (
    <Flex
      w="100%"
      overflow="auto"
      flexDirection="column"
      ml="30px"
      mt="30px"
      // border="1px solid red"
      p="10px"
      borderRadius="10px"
      // background="#000461"
    >
      <Heading position="sticky">{source}</Heading>
      <Divider mt="10px" mb="20px" />
      {insertIntoArray(
        items.map((item, index) => {
          return (
            <DraggableSearchResult
              context={items}
              {...item}
              index={index}
              key={item.url + index}
            />
          );
        }),
        <Divider borderColor="#417AF0" m="3px 0" />
      )}
    </Flex>
  );
}
