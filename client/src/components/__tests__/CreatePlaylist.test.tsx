import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
const middlewares = [thunk];
import "@testing-library/jest-dom";
import * as playlistsState from "../../mocks/playlistsState.json";
import { ChakraProvider } from "@chakra-ui/react";

import CreatePlaylist from "../CreatePlaylist";

// import { handlers } from "../mocks/handlers";

const server = setupServer();

// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

test("Create Playlist", () => {
  const mockStore = configureStore(middlewares)({
    auth: {
      userData: { displayName: "Guest" },
    },
    spotifyAuth: {
      isSignedIn: {
        isSignedIn: false,
        userData: null,
        spotifyToken: null,
      },
    },
    playerState: {
      play: false,
      url: "",
      source: "",
      context: [],
      index: 0,
    },
    createPlaylist: {
      name: "",
      id: "65d44a85-b4ad-43d5-abca-9b4b3ce8115d",
      items: [
        {
          source: "SPOTIFY",
          imageUrl: [
            {
              height: 640,
              url:
                "https://i.scdn.co/image/ab67616d0000b27360ba1d6104d0475c7555a6b2",
              width: 640,
            },
            {
              height: 300,
              url:
                "https://i.scdn.co/image/ab67616d00001e0260ba1d6104d0475c7555a6b2",
              width: 300,
            },
            {
              height: 64,
              url:
                "https://i.scdn.co/image/ab67616d0000485160ba1d6104d0475c7555a6b2",
              width: 64,
            },
          ],
          name: "TEST DRIVE",
          artist: "Joji",
          year: "2018-10-26",
          url: "spotify:track:1DMEzmAoQIikcL52psptQL",
          duration: "02:59",
        },
        {
          source: "SPOTIFY",
          imageUrl: [
            {
              height: 640,
              url:
                "https://i.scdn.co/image/ab67616d0000b2731b6dedfcf8b05b06b6bd002f",
              width: 640,
            },
            {
              height: 300,
              url:
                "https://i.scdn.co/image/ab67616d00001e021b6dedfcf8b05b06b6bd002f",
              width: 300,
            },
            {
              height: 64,
              url:
                "https://i.scdn.co/image/ab67616d000048511b6dedfcf8b05b06b6bd002f",
              width: 64,
            },
          ],
          name: "Tessellate",
          artist: "alt-J",
          year: "2012-05-28",
          url: "spotify:track:1LfKHwrMydWNruvTonm0eO",
          duration: "03:02",
        },
        {
          source: "YOUTUBE",
          imageUrl: {
            "0": {
              url: "https://i.ytimg.com/vi/3WN7Lsx0KYU/hqdefault.jpg",
              width: 480,
              height: 360,
            },
            "1": {
              url: "https://i.ytimg.com/vi/3WN7Lsx0KYU/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            "2": {
              url: "https://i.ytimg.com/vi/3WN7Lsx0KYU/default.jpg",
              width: 120,
              height: 90,
            },
          },
          name: "TES - Plotka",
          artist: "kubaconstantine11",
          year: "2008-01-19T23:54:48Z",
          url: "3WN7Lsx0KYU",
          duration: "03:07",
        },
      ],
    },
    playlists: playlistsState,
    songSearchResults: {},
    songSearchResult: {
      spotify: {},
      youtube: {},
    },
  });

  const { getByLabelText, getByText } = render(
    <ChakraProvider>
      <Provider store={mockStore}>
        <Router>
          <CreatePlaylist />
        </Router>
      </Provider>
    </ChakraProvider>
  );
  const input = getByLabelText("Playlist Name") as HTMLInputElement;
  const saveButon = getByText("Save Playlist");
  fireEvent.change(input, { target: { value: "Stephanies Playlist" } });
  fireEvent.click(saveButon);
});

// test("Edit Playlist", () => {
//   const mockStore = configureStore(middlewares)({
//     auth: {
//       userData: { displayName: "Guest" },
//     },
//     spotifyAuth: {
//       isSignedIn: {
//         isSignedIn: false,
//         userData: null,
//         spotifyToken: null,
//       },
//     },
//     playerState: {
//       play: false,
//       url: "",
//       source: "",
//       context: [],
//       index: 0,
//     },
//     createPlaylist: {
//       name: null,
//       id: undefined,
//       items: [],
//     },
//     songSearchResults: {},
//     songSearchResult: {
//       spotify: {},
//       youtube: {},
//     },
//   });

//   render(
//     <ChakraProvider>
//       <Provider store={mockStore}>
//         <Router>
//           <CreatePlaylist />
//         </Router>
//       </Provider>
//     </ChakraProvider>
//   );
// });

// test("Delete Playlist", () => {
//   const mockStore = configureStore(middlewares)({
//     auth: {
//       userData: { displayName: "Guest" },
//     },
//     spotifyAuth: {
//       isSignedIn: {
//         isSignedIn: false,
//         userData: null,
//         spotifyToken: null,
//       },
//     },
//     playerState: {
//       play: false,
//       url: "",
//       source: "",
//       context: [],
//       index: 0,
//     },
//     createPlaylist: {
//       name: null,
//       id: undefined,
//       items: [],
//     },
//     songSearchResults: {},
//     songSearchResult: {
//       spotify: {},
//       youtube: {},
//     },
//   });

//   render(
//     <ChakraProvider>
//       <Provider store={mockStore}>
//         <Router>
//           <CreatePlaylist />
//         </Router>
//       </Provider>
//     </ChakraProvider>
//   );
// });
