import React, { ReactElement, useEffect } from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { alreadySignedIn, spotifySignIn } from "./actions";
import Home from "./components/Home";
import { AppState } from "./reducers";
import { ThunkResult } from "./types";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "./actions/types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { fbAuth } from "./util/firebase_init";
import AuthOptions from "./components/AuthOptions";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";

export default function App(): ReactElement {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state: AppState) => state.auth.isSignedIn);

  useEffect(() => {
    //get and set cookies to store
    fbAuth.onAuthStateChanged(function (user) {
      if (user?.email && user.displayName) {
        dispatch(alreadySignedIn(user.email, user.displayName));
        // User is signed in.
        console.log("signed", user);
      } else {
        // No user is signed in.
        console.log("NOT SIgned");
      }
    });

    // const user = fbAuth.currentUser;
    // if (user) {
    //   // User is signed in.
    //   console.log("signed", user);
    // } else {
    //   // No user is signed in.
    //   console.log("NOT SIgned");
    // }
  }, []);

  return (
    <ThemeProvider>
      <CSSReset />
      <Router>
        {/* if not signed in, take me to the auth screen */}
        {isSignedIn ? (
          //Route might be too loose. Will nee to use a Switch statement later
          <Route path="/" component={Home} />
        ) : (
          //Auth Routes
          <>
            <Route exact path="/" component={AuthOptions} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/new-account" component={SignUp} />
          </>
        )}
      </Router>
    </ThemeProvider>
  );
}
