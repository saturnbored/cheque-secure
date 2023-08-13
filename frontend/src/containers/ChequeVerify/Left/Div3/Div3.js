import React, { Component, useState } from "react";
import classes from "./Div3.module.css";
import { InputGroup } from "react-bootstrap";

const Div3 = (props) => {
  const [sigVerify, setSigVerify] = useState(false);

  const approveHandler = () => {
    if (sigVerify) {
      props.approveCheque();
    }
  };

  return (
    <div>
      <p
        className={classes.P2}
        onClick={() => {
          props.setDiv(2);
        }}
      >
        <i className="fas fa-chevron-left"></i> Back
      </p>
      <InputGroup className={classes.Row} size="lg">
        <img
          style={{ display: "inline", maxWidth: "50%" }}
          src={`data:image/png;base64,${props.signature}`}
          alt="Sign"
        />
        <InputGroup.Checkbox
          className={classes.Checkbox}
          checked={sigVerify}
          onChange={(evt) => setSigVerify(evt.target.checked)}
        />
      </InputGroup>
      <div className={classes.BtnGroup}>
        <button
          className={classes.DeclineBtn}
          onClick={() => props.declineCheque()}
        >
          <i className="fas fa-times"></i> Decline
        </button>
        <button className={classes.NextBtn} onClick={approveHandler}>
          <i className="fas fa-check"></i> Approve
        </button>
      </div>
    </div>
  );
};

export default Div3;
