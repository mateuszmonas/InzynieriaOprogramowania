import React from "react";

import "./Account.css";

const Account = (props) => {
  return (
    <div className="account">
      <h1>Here will be account view</h1>
      <button type="button" onClick={() => props.setStage("lecturer")}>
        Go to lecturer view
      </button>
      <button type="button" onClick={() => props.setStage("student")}>
        Go to student view
      </button>
    </div>
  );
};

export default Account;
