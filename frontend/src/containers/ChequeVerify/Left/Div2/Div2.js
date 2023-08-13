import React, { useState } from "react";
import classes from "./Div2.module.css";
import axios from "../../../../chequeAxios";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";

const Div2 = (props) => {
  const handleVerify = async () => {
    //axios request to verify and get payee name
    const res = await axios.get("/api/recipientName", {
      params: { recipientAccountNo: props.state.accountNumber },
    });
    if (res.data === "Invalid Account Number") {
      props.setState({
        ...props.state,
        accountVerify: 0,
        recipientName: res.data
      });
    }
    else {
      props.setState({
        ...props.state,
        accountVerify: 1,
        recipientName: res.data.recipientName
      });
    }
  };

  const changeHandler = (evt) => {
    props.setState({ ...props.state, [evt.target.name]: evt.target.value });
  };

  const nextHandler = async () => {
    const reg = /^\d{15}$/;
    const amtreg = "^[1-9][0-9]*$";
    if (
      !props.state.accountNumber.match(reg) ||
      !props.state.amount.match(amtreg)
    ) {
      props.setState({
        ...props.state,
        err: "*Invalid Account Number or Amount",
      });
    } else {
      props.setState({ ...props.state, err: "" });
      if (
        props.state.err === "" &&
        props.state.accountVerify === 1 &&
        props.state.recipientNameCheck
      ) {
        props.setDiv(3);
      }
    }
  };

  return (
    <div>
      <p
        className={classes.P2}
        onClick={() => {
          props.setDiv(1);
        }}
      >
        <i class="fas fa-chevron-left"></i> Back
      </p>
      <Form.Group
        className="mb-4"
        controlId="account"
        style={{ width: "80%", margin: "auto" }}
      >
        <Form.Label>Payee Account Number</Form.Label>
        <div className={classes.VerifyAccount}>
          <Form.Control
            type="text"
            required
            placeholder="Payee Account Number"
            className={classes.Input}
            autoFocus
            name="accountNumber"
            onChange={changeHandler}
            value={props.state.accountNumber}
          />
          <button className={classes.VerifyBtn} onClick={handleVerify}>
            Verify
          </button>
        </div>
        <div></div>
      </Form.Group>
      <Form.Group
        className="mb-4"
        controlId="amount"
        style={{ width: "80%", margin: "auto" }}
      >
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="text"
          required
          placeholder="Enter amount"
          className={classes.Input}
          name="amount"
          onChange={changeHandler}
          value={props.state.amount}
        />
        <div className={classes.Error}>
          {props.state.err ? props.state.err : null}
        </div>
      </Form.Group>
      <InputGroup
        className={classes.Row}
        size="lg"
        style={{ width: "80%", margin: "auto" }}
      >
        <div>
          <p className={classes.PTitle}>Recipient Name</p>
          <p className={classes.PDetail}>{props.state.recipientName}</p>
        </div>
        <InputGroup.Checkbox
          className={classes.Checkbox}
          onChange={(event) =>
            props.setState({
              ...props.state,
              recipientNameCheck: event.target.checked,
            })
          }
          checked={props.state.recipientNameCheck}
        />
      </InputGroup>
      <div className={classes.BtnGroup}>
        <button className={classes.DeclineBtn} onClick={() => props.declineCheque()}>
          <i className="fas fa-times"></i> Decline
        </button>
        <button className={classes.NextBtn} onClick={nextHandler}>
          <i className="fas fa-check"></i> Next
        </button>
      </div>
    </div>
  );
};

export default Div2;
