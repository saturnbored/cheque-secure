import classes from "./CustomerDashboard.module.css";
import { useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import UploadChequeModal from "../../components/UploadChequeModal/UploadChequeModal";
import ChequeList from "../../components/ChequeList/ChequeList";
const CustomerDashboard = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const handleClose = () => setShowDepositModal(false);
  const handleShow = () => setShowDepositModal(true);
  const [reload, setReload] = useState(false);
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  if (!auth) {
    history.push("/auth");
  } else {
    if (user.name === "") {
      history.push("/adminDashboard");
    }
  }
  return (
    auth &&
    user.name !== "" && (
      <div>
        <UploadChequeModal
          showDepositModal={showDepositModal}
          handleClose={handleClose}
          setReload={setReload}
          reload={reload}
        />
        <div className={classes.Parent}>
          <ChequeList reload={reload} />
          <div className={classes.Options}>
            <div className={classes.ButtonDeposit} onClick={handleShow}>
              <i className="fas fa-upload"></i>&nbsp;Deposit
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CustomerDashboard;
