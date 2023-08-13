import React, { Component } from "react";
import classes from "./Right.module.css";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

class Right extends Component {
  state = {
    div: false, // 0: SignIn, 1: SignUp
  };
  changeAuthMethod = () => {
    this.setState((prevState) => {
      return { div: !prevState.div };
    });
  };
  render() {
    return (
      <div className={classes.Right}>
        {this.state.div ? (
          <SignUp changeAuthMethod={this.changeAuthMethod} />
        ) : (
          <SignIn changeAuthMethod={this.changeAuthMethod} />
        )}
      </div>
    );
  }
}

export default Right;
