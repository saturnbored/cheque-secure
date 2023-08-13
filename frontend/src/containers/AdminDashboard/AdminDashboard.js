import classes from "./AdminDashboard.module.css";
import { useState, useEffect } from "react";
import axios from "../../chequeAxios";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import loader from "../../assets/loader.svg";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const handleClose = () => setShowDepositModal(false);
  const handleShow = () => setShowDepositModal(true);
  const [reload, setReload] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  if (!auth) {
    history.push("/admin");
  } else {
    if (user.name !== "") {
      console.log(user);
      history.push("/");
    }
  }
  useEffect(() => {
    const func = async () => {
      const res = await axios.get("/api/adminDashboard");
      setTransactions(res.data);
      setLoading(false);
    };
    func();
  });
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
      <div className={classes.Parent}>
        <h2 className={classes.H2}>Pending Requests({transactions.length})</h2>
        {transactions.map((transaction) => (
          <Link
            to={`/chequeVerify?id=${transaction}`}
            className={classes.Link}
            key={transaction}
          >
            <div className={classes.Child}>
              <p>{transaction}</p>
            </div>
          </Link>
        ))}
      </div>
    ))
  );
};

export default AdminDashboard;
