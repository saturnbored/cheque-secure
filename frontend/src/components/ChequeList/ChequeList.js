import ChequeListItem from "../ChequeListItem/ChequeListItem";
import { useState, useEffect } from "react";
import classes from "./ChequeList.module.css";
import axios from "../../chequeAxios";
import { useSelector } from "react-redux";
import loader from "../../assets/loader.svg";

const ChequeList = (props) => {
  const [filter, setFilter] = useState(2);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = useSelector((state) => state.user.username);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const res = await axios.get("/api/transactions", {
        params: { username: username },
      });
  
      setTransactions(res.data);
      setLoading(false);
    };
    func();
  }, [props.reload]);
  return (
    <>
      <div className={classes.List}>
        <div className={classes.Filters}>
          <div
            className={filter === 2 ? classes.Button : classes.ButtonInactive}
            onClick={() => setFilter(2)}
          >
            Pending
          </div>
          <div
            className={filter === 1 ? classes.Button : classes.ButtonInactive}
            onClick={() => setFilter(1)}
          >
            Approved
          </div>
          <div
            className={filter === 0 ? classes.Button : classes.ButtonInactive}
            onClick={() => setFilter(0)}
          >
            Declined
          </div>
        </div>
        {loading ? (
          <img
            src={loader}
            alt="loader"
            style={{ display: "block", margin: "10vh auto" }}
          />
        ) : (
          transactions.map(
            (transaction) =>
              transaction.chequeStatus === filter && (
                <ChequeListItem
                  status={transaction.chequeStatus}
                  id={transaction._id}
                  key={transaction._id}
                />
              )
          )
        )}
      </div>
    </>
  );
};

export default ChequeList;
