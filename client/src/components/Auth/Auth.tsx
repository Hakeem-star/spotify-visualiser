import React, { ReactElement } from "react";

import SignUp from "./SignUp";

export default function Auth({}): ReactElement {
  return (
    <div>
      <SignUp firebase={firebase} />
    </div>
  );
}
