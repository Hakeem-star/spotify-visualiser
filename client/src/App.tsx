import React, { ReactElement, useEffect } from "react";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { connect } from "react-redux";
import { signIn } from "./actions";
import Home from "./components/Home";
import { AppState } from "./reducers";
import { ThunkResult } from "./types";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "./actions/types";
import SignIn from "./components/SignIn";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import { fbAuth } from "./util/firebase_init";

interface AppProps {
  signIn: () => ThunkResult<void>;
  isSignedIn: boolean | null;
}

function App({ signIn, isSignedIn }: AppProps): ReactElement {
  useEffect(() => {
    //get and set cookies to store
    signIn();
    console.log(isSignedIn);
  }, []);

  return (
    <ThemeProvider>
      <CSSReset />
      <Auth />
      <Router>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/login">
          <SignIn />
        </Route>
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
  signIn: bindActionCreators(signIn, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
