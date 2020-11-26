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

import App from "./App";
import { ThemeProvider } from "@chakra-ui/core";
describe("Auth options", () => {
  const store = {
    auth: {
      userData: { displayName: "Guest" },
      isSignedIn: false,
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
  };
  const mockStore = configureStore(middlewares)(store);

  test("Shows the sign in options if not signed in", () => {
    render(
      <ThemeProvider>
        <Provider store={mockStore}>
          <Router>
            <App />
          </Router>
        </Provider>
      </ThemeProvider>
    );

    const signIn = screen.getByText("Sign in");
    const createAccount = screen.getByText("Create an account");
    const continueWithout = screen.getByText("Continue without an Account");

    expect(signIn).toBeInTheDocument();
    expect(createAccount).toBeInTheDocument();
    expect(continueWithout).toBeInTheDocument();
  });

  test("Takes you to the home page if already signed in", () => {
    store.auth.isSignedIn = true;
    render(
      <ThemeProvider>
        <Provider store={mockStore}>
          <Router>
            <App />
          </Router>
        </Provider>
      </ThemeProvider>
    );
    const signIn = screen.queryByText("Sign in");
    const guest = screen.getByText("Guest");

    expect(signIn).not.toBeInTheDocument();
    expect(guest).toBeInTheDocument();
  });
});
