import React, { useState, useEffect } from "react";
import classes from "./ChequeVerify.module.css";
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import Left from "./Left/Left";
import { useHistory } from "react-router";
import axios from "../../chequeAxios";
import { useSelector } from "react-redux";
import loader from "../../assets/loader.svg";
import str2ab from "../../utilities/stringToArrayBuffer";
import decryptImageWithAesKey from "../../utilities/decryptFile";

const ChequeVerify = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const encryptedAesKey = useSelector((state) => state.encryptedAesKey);
  const user = useSelector((state) => state.user);
  const [id, setID] = useState("");
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");
  const [signature, setSignature] = useState("");
  const [acNo, setAcNo] = useState("");
  const [MICR, setMICR] = useState("");
  if (!auth) {
    history.push("/admin");
  } else {
    if (user.name !== "") {
      history.push("/");
    }
  }
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      let searchParams = new URLSearchParams(history.location.search);
      for (const [key, value] of searchParams) {
        const res = await axios.get("/api/detailedCheque", {
          params: { cheque_id: value },
        });
        console.log(res.data);
        setID(value);
        const res1 = await decryptImageWithAesKey(
          str2ab(res.data.photo[0]).buffer,
          encryptedAesKey
        );
        setFrontImage(res1);
        const res2 = await decryptImageWithAesKey(
          str2ab(res.data.photo[1]).buffer,
          encryptedAesKey
        );
        setBackImage(res2);
        setSignature(res.data.signatureImagebase64);
        setAcNo(res.data.acNo);
        setMICR(res.data.chequeCode);
        setLoading(false);
      }
    };
    func();
  }, []);
  return (
    auth &&
    user.name === "" &&
    (loading ? (
      <img
        src={loader}
        alt="loader"
        style={{ display: "block", margin: "10vh auto" }}
      />
    ) : (
      <div className={classes.ChequeVerify}>
        <p className={classes.P}>Transaction ID: {id}</p>
        <div className={classes.Parent}>
          <div className={classes.Left}>
            <Left
              acNo={acNo}
              MICR={MICR}
              signature={signature}
              chequeCode={id}
            />
          </div>
          <div className={classes.Right}>
            <ImageCarousel frontImage={frontImage} backImage={backImage} />
          </div>
        </div>
      </div>
    ))
  );
};

export default ChequeVerify;
