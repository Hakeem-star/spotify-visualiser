import React, { ReactElement, useEffect } from "react";
import SignIn from "./components/SignIn";
import { connect } from "react-redux";
import { signIn } from "./actions";

function App({ signIn, isSignedIn }): ReactElement {
  useEffect(() => {
    //get and set cookies to store
    signIn();
    console.log(isSignedIn);
  }, []);

  return (
    <div>
      <SignIn />
    </div>
  );
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};
export default connect(mapStateToProps, { signIn })(App);
