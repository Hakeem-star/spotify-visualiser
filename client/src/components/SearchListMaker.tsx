import { Divider, Flex, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { remappedSearchResult } from "../types";
import SearchResultList from "./SearchResultList";

const VerticalResultsDivider = () => (
  <Divider
    orientation="vertical"
    height="93%"
    alignSelf="center"
    borderColor="#417AF0"
    m="0 3px"
  />
);

interface Props {
  results: remappedSearchResult | null;
  id: string;
  fetching: boolean;
}

export const SearchListMaker = ({
  results,
  id,
  fetching,
}: Props): ReactElement | null => {
  if (results?.error) {
    //if there is an error, push error message
    return <Text key={id}>{results.error?.message}</Text>;
  }

  //if there is at least 1 item in the response, show that

  return (
    <Droppable
      key={id}
      isDropDisabled={true}
      droppableId={`${id}SearchResultContainer`}
    >
      {(provided) => (
        <Flex minW="300px">
          <Flex
            direction="row"
            overflow="overlay"
            w="100%"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <SearchResultList
              fetching={fetching}
              key={id}
              source={id}
              items={results?.items}
            />
          </Flex>
        </Flex>
      )}
    </Droppable>
  );
};
