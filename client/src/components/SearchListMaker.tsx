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
}

export const SearchListMaker = ({
  results,
  id,
}: Props): ReactElement | null => {
  if (results) {
    if (results.error) {
      //if there is an error, push error message
      return <Text key={id}>{results.error?.message}</Text>;
    } else {
      if (results.items?.length > 0) {
        //if there is at least 1 item in the response, show that

        return (
          <Droppable
            key={id}
            isDropDisabled={true}
            droppableId={`${id}SearchResultContainer`}
          >
            {(provided) =>
              results !== null ? (
                <Flex maxW="40%" w="26%" minW="250px">
                  <Flex
                    direction="row"
                    overflow="overlay"
                    w="100%"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <SearchResultList
                      key={id}
                      source={id}
                      items={results.items}
                    />
                  </Flex>
                  <VerticalResultsDivider key={id + "VerticalResultsDivider"} />
                </Flex>
              ) : (
                <></>
              )
            }
          </Droppable>
        );
      }
    }
  }
  return null;
};
