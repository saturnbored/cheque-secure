import React from "react";
import classes from "./Auth.module.css";
import Left from "./Left/Left";
import Right from "./Right/Right";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

const Auth = (props) => {
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  if (auth) {
    if (user.name !== null) {
      // Customer
      history.push("/");
    } else {
      history.push("/adminDashboard");
    }
  }
  return (
    !auth && (
      <div className={classes.Parent}>
        <Left />
        <Right />
      </div>
    )
  );
};

export default Auth;
