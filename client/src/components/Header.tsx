/** @jsx jsx */
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  List,
  ListItem,
  Text,
  Link as ChakLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  InputRightAddon,
  Switch,
} from "@chakra-ui/react";
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { GiFireWave } from "react-icons/gi";
import { RiFullscreenLine } from "react-icons/ri";
import { Link, useHistory } from "react-router-dom";
import { signOut, songSearch } from "../actions";
import { debounce } from "../util/debounce";
import { AppState } from "../reducers";
import { setCreatePlaylistSidebar } from "../actions/createPlaylistSidebarActions";
import { FaUserNinja } from "react-icons/fa";
import { jsx, css } from "@emotion/react";
import SourceSelector from "./SourceSelector";
import { GUEST } from "../actions/types";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
  setToggleVisualiserOn: Dispatch<SetStateAction<boolean>>;
  toggleVisualiserOn: boolean;
  setVisualiserPrompt: Dispatch<SetStateAction<boolean>>;
  setVisualiserFullscreen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({
  connectToSpotifyModalToggle,
  setToggleVisualiserOn,
  toggleVisualiserOn,
  setVisualiserFullscreen,
  setVisualiserPrompt,
}: Props): ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();
  const displayName = useSelector(
    (state: AppState) => state.auth.userData?.displayName || GUEST
  );
  const [searchInputValue, setSearchInputValue] = useState("");
  const debounceSearch = useRef(
    debounce((value) => {
      dispatch(songSearch(value));
    }, 1000)
  );

  const [popOverOpenState, setPopOverOpenState] = useState(false);
  const [visualiserSwitch, setVisualiserSwitch] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    console.log({ value: event.target.value });
    debounceSearch.current(event.target.value);
  };

  useEffect(() => {
    setVisualiserSwitch(toggleVisualiserOn);
  }, [toggleVisualiserOn]);

  return (
    <Flex
      position="sticky"
      top="0"
      background="#46484e"
      justifyContent="left"
      w="100%"
      h="7%"
      align="center"
      borderBottom="3px solid #A31709"
      zIndex="100"
    >
      <Box
        style={{ placeItems: "center" }}
        w="10%"
        display="grid"
        onClick={() => {
          history.push("/");
        }}
      >
        <GiFireWave fontSize={70} />
      </Box>
      <InputGroup onFocus={() => setPopOverOpenState(true)} width="330px">
        <Input type="text" onChange={handleChange} value={searchInputValue} />
        <InputRightAddon>
          <AiOutlineSearch />
        </InputRightAddon>
      </InputGroup>
      <SourceSelector
        connectToSpotifyModalToggle={connectToSpotifyModalToggle}
      />

      <Flex
        flex="1"
        height="100%"
        justifyContent="flex-end"
        alignItems="center"
      >
        <List
          h="100%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          w="30%"
          color="white"
          marginRight="160px"
        >
          <ListItem
            css={css`
              height: calc(100% + 3px);
              display: grid;
              align-self: flex-start;
              place-items: center;
              transition: border 0.3s ease;
              &:hover {
                border-bottom: 3px solid blue;
              }
            `}
          >
            <Link to="/playlists">Your Playlists</Link>
          </ListItem>
          <Box></Box>
          <ListItem
            css={css`
              height: calc(100% + 3px);
              display: flex;
              align-self: flex-start;
              transition: border 0.3s ease;
              align-items: center;

              &:hover {
                border-bottom: 3px solid blue;
              }
            `}
          >
            <Text mr="10px">Visualiser</Text>
            <Switch
              isChecked={visualiserSwitch}
              css={css`
                > span {
                  background: #a31709;
                }
              `}
              size="md"
              onChange={(event) => {
                //May need to change this to controlled
                console.log({ event: event.target.checked });
                setVisualiserPrompt(event.target.checked);
              }}
              id="Visualiser"
            />
          </ListItem>
          <ListItem w="60px" h="100%">
            {toggleVisualiserOn && (
              <Grid
                placeItems="center"
                height="100%"
                fontSize="1.5rem"
                cursor="pointer"
                onClick={() => {
                  setVisualiserFullscreen(true);
                }}
              >
                <RiFullscreenLine />
              </Grid>
            )}
          </ListItem>
        </List>

        <Menu>
          <MenuButton size="sm" mr="20px" as={Button}>
            <Flex>
              {displayName}
              <FaUserNinja
                css={css`
                  margin-left: 10px;
                `}
              />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                dispatch(signOut(displayName));
                history.push("/");
              }}
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}
