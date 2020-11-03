import React, { ReactElement, useEffect } from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { connect } from "react-redux";
import { spotifySignIn } from "./actions";
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

interface AppProps {
  signIn: () => ThunkResult<void>;
  isSignedIn: boolean | null;
}

function App({ signIn, isSignedIn }: AppProps): ReactElement {
  useEffect(() => {
    //get and set cookies to store
    fbAuth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log("signed", user);
      } else {
        // No user is signed in.
        console.log("NOT SIgned");
      }
    });
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

const mapStateToProps = (state: AppState) => {
  console.log(state);
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>) => ({
  signIn: bindActionCreators(spotifySignIn, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
