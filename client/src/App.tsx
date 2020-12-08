import React, { ReactElement, useEffect, useState } from "react";
import { ChakraProvider, Flex, Text } from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { alreadySignedIn } from "./actions";
import Home from "./components/Home";
import { AppState } from "./reducers";
import { GUEST } from "./actions/types";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { fbAuth } from "./util/firebase_init";
import AuthOptions from "./components/AuthOptions";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";

export default function App(): ReactElement {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state: AppState) => state.auth.isSignedIn);
  const [checkedSignIn, setCheckedSignIn] = useState(false);

  useEffect(() => {
    //get and set cookies to store
    fbAuth.onAuthStateChanged(function (user) {
      //Check if User on FireBase
      if (user?.email && user.displayName) {
        dispatch(alreadySignedIn(user.email, user.displayName));
        // User is signed in.
        console.log("Signed", user);
      } else if (sessionStorage.getItem("guestSignedIn")) {
        const guestSignInStatus = Number(
          sessionStorage.getItem("guestSignedIn")
        );

        console.log({
          sessionStorage: sessionStorage.getItem("guestSignedIn"),
        });

        // No user is signed in.
        console.log("Not Signed");
        //Set session storage so we do not ask them to sign in again over and over again during this session
        guestSignInStatus && dispatch(alreadySignedIn(GUEST, GUEST));
      }
      setCheckedSignIn(true);
    });
  }, []);

  return !checkedSignIn ? (
    // Loading screen
    <ChakraProvider resetCSS>
      <Flex justify="center " w="100vw" h="100vh" alignItems="center">
        <Text>Loading...</Text>
      </Flex>
    </ChakraProvider>
  ) : (
    <ChakraProvider resetCSS>
      <Router>
        {/* if not signed in, take me to the auth screen */}
        {isSignedIn ? (
          //Route might be too loose. Will need to use a Switch statement later
          <>
            <Route path="/" component={Home} />
          </>
        ) : (
          //Auth Routes
          <>
            <Route exact path="/" component={AuthOptions} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/new-account" component={SignUp} />
          </>
        )}
      </Router>
    </ChakraProvider>
  );
}
