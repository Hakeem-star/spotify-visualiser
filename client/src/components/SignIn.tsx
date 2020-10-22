import axios from "axios";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { signIn } from "../actions";

function SignIn(): ReactElement {
  return (
    <div>
      {/* Login */}
      <a href="http://localhost:3000/spotify/login">Click First</a>
      <button
        onClick={() => {
          axios.get("http://localhost:3000/search/test", {
            withCredentials: true,
          });
        }}
      >
        Sign in
      </button>
    </div>
  );
}
export default connect(null, { signIn })(SignIn);
