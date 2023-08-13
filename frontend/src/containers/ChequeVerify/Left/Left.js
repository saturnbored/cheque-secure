import React, { Component } from "react";
import classes from "./Left.module.css";
import Div1 from "./Div1/Div1";
import Div2 from "./Div2/Div2";
import Div3 from "./Div3/Div3";
import encryptWithServerPublicKey from "../../../utilities/encrypt";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "../../../chequeAxios";
import { useHistory } from "react-router";
import loader from "../../../assets/loader.svg";

const Left = (props) => {
  const [state, setState] = useState({
    accountVerify: 0,
    amount: "",
    accountNumber: "",
    err: "",
    recipientNameCheck: false,
    recipientName: "",
  });
  const [verifyState, setVerifyState] = useState({
    dateVerify: false,
    amountVerify: false,
    acNoVerify: false,
    cCodeVerify: false,
  });
  const [loading, setLoading] = useState(false);
  const public_key = useSelector((state) => state.key);
  const history = useHistory();
  const approveCheque = async () => {
    setLoading(true);
    let reqObj = {
      status: true,
      _id: props.chequeCode,
    };
    const obj = {
      amount: Number(state.amount),
      recipientName: state.recipientName,
      recipientAccountNo: state.accountNumber,
    };
    const encryptedObj = await encryptWithServerPublicKey(obj, public_key);
    reqObj = { ...reqObj, object: encryptedObj };
    const req = async () => {
      const res = await axios.post("/api/verifyCheque", reqObj);
      console.log(res);
    };
    req();
    setLoading(false);
    history.push("/adminDashboard");
  };

  const declineCheque = async () => {
    setLoading(true);
    let reqObj = {
      status: false,
      _id: props.chequeCode,
    };
    const req = async () => {
      const res = await axios.post("/api/verifyCheque", reqObj);
      console.log(res);
    };
    req();
    setLoading(false);
    history.push("/adminDashboard");
  };
  useEffect(() => {
    if (
      state.err === "" &&
      state.accountVerify === 1 &&
      state.recipientNameCheck
    ) {
      setDiv(3);
    }
  }, [state.err]);
  const [div, setDiv] = useState(1);
  return loading ? (
    <img
      src={loader}
      alt="loader"
      style={{ display: "block", margin: "10vh auto" }}
    />
  ) : (
    <div className={classes.Left}>
      {div === 1 && (
        <Div1
          setDiv={setDiv}
          verifyState={verifyState}
          setVerifyState={setVerifyState}
          acNo={props.acNo}
          MICR={props.MICR}
          declineCheque={declineCheque}
        />
      )}
      {div === 2 && (
        <Div2
          setDiv={setDiv}
          state={state}
          setState={setState}
          declineCheque={declineCheque}
        />
      )}
      {div === 3 && (
        <Div3
          setDiv={setDiv}
          signature={props.signature}
          approveCheque={approveCheque}
          declineCheque={declineCheque}
        />
      )}
    </div>
  );
};

export default Left;
