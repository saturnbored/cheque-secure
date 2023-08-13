import React from "react";
import classes from "./Left.module.css";

const Left = (props) => {
  return (
    <div className={classes.Left}>
      <i style={{fontSize: "4vw", margin: "1vh auto"}} className="fab fa-atlassian"></i>
      <p>Deposit Cheques with a single click!</p>
    </div>
  );
};

export default Left;
