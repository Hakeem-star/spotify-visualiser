import React, { ReactElement, useEffect, useState } from "react";
import { ChakraProvider, Flex, Text } from "@chakra-ui/react";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { alreadySignedIn } from "./actions";
import Home from "./components/Home";
import { AppState } from "./reducers";
import { GUEST } from "./actions/types";
import { Route, useHistory, useLocation } from "react-router-dom";
import { fbAuth } from "./util/firebase_init";
import AuthOptions from "./components/AuthOptions";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import useSpotifyPlayer from "./components/SpotifyPlayer";
import YouTubePlayer from "./components/YouTubePlayer";
import { getCookie, setCookie } from "./util/cookie";

export default function App(): ReactElement {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state: AppState) => state.auth.isSignedIn);
  const [checkedSignIn, setCheckedSignIn] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  useSpotifyPlayer();
  const history = useHistory();
  const urlPath = window.location;
  //get Cookie from Spotify sign in redirect and set as cookie
  useEffect(() => {
    if (urlPath.search.includes("spotifyLogIn")) {
      const parsed = queryString.parse(urlPath.search);
      Object.keys(parsed).forEach((name) => {
        const value = parsed[name];
        const expiryValue = parsed["expires_in"];
        if (typeof value === "string") {
          setCookie(name, value, Number(expiryValue));
        }
      });
      history.push("/");
    }
  }, []);

  useEffect(() => {
    //insert the Youtube Player API src if not on page
    const tag = document.createElement("script");
    if (!window.YT) {
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      // console.log({ first: firstScriptTag.parentNode });
      if (firstScriptTag !== null) {
        firstScriptTag.appendChild(tag);
        tag.onload = () => {
          const clearcheck = setInterval(repeatcheck, 500, 0);
          function repeatcheck(oldvalue: number) {
            if (window.YT.loaded !== oldvalue) {
              // do something
              clearInterval(clearcheck);
              setYtReady(true);
              console.log(
                "check value changed from " +
                  oldvalue +
                  " to " +
                  window.YT.loaded
              );
            }
          }
        };
      }
    }
  }, []);

  useEffect(() => {
    //get and set cookies to store
    fbAuth.onAuthStateChanged(function (user) {
      console.log({ USER: [user?.email, user?.displayName, user] });
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
      history.push("/");
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

      {ytReady ? <YouTubePlayer /> : null}
    </ChakraProvider>
  );
}
