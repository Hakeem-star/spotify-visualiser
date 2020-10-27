import { Flex } from "@chakra-ui/core";
import axios from "axios";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { signIn } from "../actions";
import { Link } from "react-router-dom";

function SignIn(): ReactElement {
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
      <a href="http://localhost:3000/spotify/login">
        <button>Sign in</button>
      </a>
      <a href="">Create an account</a>
      <Link to="/">Continue without an Account</Link>
    </div>
  );
}
Link;
export default connect(null, { signIn })(SignIn);
