import { InputGroup } from "react-bootstrap";
import classes from "./Div1.module.css";
import { useState, createRef } from "react";

const Div1 = (props) => {
  const [err, setErr] = useState("");
  const changeHandler = (evt) => {
    // if (evt.target.checked) {
    //   setCheckBoxCount(checkboxCount + 1);
    // } else {
    //   setCheckBoxCount(checkboxCount - 1);
    // }
    props.setVerifyState({
      ...props.verifyState, [evt.target.name]: evt.target.checked
    })
  };

  const nextHandler = () => {
    if (props.verifyState.dateVerify && props.verifyState.amountVerify && props.verifyState.acNoVerify && props.verifyState.cCodeVerify) {
      props.setDiv(2);
    } else {
      setErr("*Please verify all details");
    }
  };
  return (
    <div>
      <InputGroup className={classes.Row} size="lg">
        <div>
          <p className={classes.PTitle}>Date</p>
        </div>
        <InputGroup.Checkbox className={classes.Checkbox} name="dateVerify" checked={props.verifyState.dateVerify} onChange={changeHandler}/>
      </InputGroup>
      <InputGroup className={classes.Row} size="lg">
        <div>
          <p className={classes.PTitle}>Amount</p>
        </div>
        <InputGroup.Checkbox className={classes.Checkbox} name="amountVerify" checked={props.verifyState.amountVerify} onChange={changeHandler} />
      </InputGroup>
      <InputGroup className={classes.Row} size="lg">
        <div>
          <p className={classes.PTitle}>Account Number</p>
          <p className={classes.PDetail}>{props.acNo}</p>
        </div>
        <InputGroup.Checkbox className={classes.Checkbox} name="acNoVerify" checked={props.verifyState.acNoVerify} onChange={changeHandler}/>
      </InputGroup>
      <InputGroup className={classes.Row} size="lg">
        <div>
          <p className={classes.PTitle}>Cheque Code</p>
          <p className={classes.PDetail}>{props.MICR}</p>
        </div>
        <InputGroup.Checkbox className={classes.Checkbox} name="cCodeVerify" checked={props.verifyState.cCodeVerify} onChange={changeHandler}/>
      </InputGroup>
      <div className={classes.Error}>{err ? err : null}</div>
      <div className={classes.BtnGroup}>
        <button className={classes.DeclineBtn} onClick={() => props.declineCheque()}>Decline</button>
        <button className={classes.NextBtn} onClick={nextHandler}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Div1;
