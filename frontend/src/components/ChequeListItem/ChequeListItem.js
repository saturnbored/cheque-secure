import classes from "./ChequeListItem.module.css";
import ImageModal from "../ImageModal/ImageModal";
import { useState } from "react";
const ChequeListItem = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const handleClose = () => setShowImageModal(false);
  const handleShow = () => setShowImageModal(true);

  return (
    <>
      <ImageModal showImageModal={showImageModal} handleClose={handleClose} _id={props.id} />

      <div className={classes.Parent} onClick={handleShow}>
        <div className={classes.Id}>{props.id}</div>
        <div className={classes.Status}>
          {props.status === 2 ? (
            <span style={{ color: "#a6a6a6", fontWeight: "bold" }}>
              <i
                className="fas fa-clock"
                aria-hidden="true"
                style={{ color: "#a6a6a6" }}
              ></i>
              &nbsp;Pending
            </span>
          ) : null}
          {props.status === 1 ? (
            <span style={{ color: "#27a844", fontWeight: "bold" }}>
              <i
                className="fa fa-check"
                aria-hidden="true"
                style={{ color: "#27a844" }}
              ></i>
              &nbsp;Verified
            </span>
          ) : null}
          {props.status === 0 ? (
            <span style={{ color: "#dc3546", fontWeight: "bold" }}>
              <i
                className="fa fa-times"
                aria-hidden="true"
                style={{ color: "#dc3546" }}
              ></i>
              &nbsp;Declined
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ChequeListItem;
