import { Flex } from "@chakra-ui/react";
import axios from "axios";
import React, { ReactElement } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { signInAsGuest } from "../actions";
import { Link } from "react-router-dom";

export default function AuthOptions(): ReactElement {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: "Flex",
        flexDirection: "column",
        margin: "auto",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link title="Sign in" to="/sign-in">
        <button>Sign in</button>
      </Link>
      <Link title="Create an account" to="/new-account">
        Create an account
      </Link>
      <Link
        onClick={() => {
          dispatch(signInAsGuest());
        }}
        title="No access to Spotify songs"
        to="/"
      >
        Continue without an Account
      </Link>
    </div>
  );
}
