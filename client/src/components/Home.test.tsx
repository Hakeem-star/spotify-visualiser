import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
const middlewares = [thunk];
import "@testing-library/jest-dom";

import Home from "./Home";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

// import { handlers } from "../mocks/handlers";

const server = setupServer();

// establish API mocking before all tests
beforeAll(() => server.listen());
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// clean up once the tests are done
afterAll(() => server.close());

test("It shows you as a guest when you sign in", () => {
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
      name: null,
      id: undefined,
      items: [],
    },
    songSearchResults: {},
    songSearchResult: {
      spotify: {},
      youtube: {},
    },
  });

  render(
    <ThemeProvider>
      <Provider store={mockStore}>
        <Router>
          <Home />
        </Router>
      </Provider>
    </ThemeProvider>
  );

  const guest = screen.getByText("Guest");

  expect(guest).toBeInTheDocument();
});
