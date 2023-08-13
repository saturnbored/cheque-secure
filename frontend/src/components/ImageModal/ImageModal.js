import { Modal } from "react-bootstrap";
import classes from "./ImageModal.module.css";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import { useEffect, useState } from "react";
import axios from "../../chequeAxios";
import decryptImageWithAesKey from "../../utilities/decryptFile";
import { useSelector } from "react-redux";
import str2ab from "../../utilities/stringToArrayBuffer";
import loader from "../../assets/loader.svg";

const ImageModal = (props) => {
  const encryptedAesKey = useSelector((state) => state.encryptedAesKey);
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const req = async () => {
      setLoading(true);
      const res = await axios.get("/api/transactionDetail", {
        params: {
          _id: props._id,
        },
      });
      console.log(str2ab(res.data.chequePhotographs[0]).buffer);
      const res1 = await decryptImageWithAesKey(
        str2ab(res.data.chequePhotographs[0]).buffer,
        encryptedAesKey
      );
      // console.log(res1)
      setFrontImage(res1);
      const res2 = await decryptImageWithAesKey(
        str2ab(res.data.chequePhotographs[1]).buffer,
        encryptedAesKey
      );
      // console.log(res2)
      setBackImage(res2);
      setLoading(false);
    };
    if (props.showImageModal) req();
  }, [props.showImageModal]);
  return (
    <>
      <Modal
        show={props.showImageModal}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="cheque-image"
      >
        <Modal.Header className={classes.ModalHeader}>
          <Modal.Title>Cheque Images</Modal.Title>
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={props.handleClose}
          ></i>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <img
              src={loader}
              alt="loader"
              style={{ display: "block", margin: "10vh auto" }}
            />
          ) : (
            <ImageCarousel frontImage={frontImage} backImage={backImage} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageModal;
