import { Navbar } from "react-bootstrap";
import classes from "./Menu.module.css";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useSelector } from "react-redux";
const Menu = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleClose = () => setShowProfileModal(false);
  const handleShow = () => setShowProfileModal(true);
  const username = useSelector((state) =>
    state.user ? state.user.username : ""
  );
  const pathname = useHistory().location.pathname;
  const auth = useSelector((state) => state.auth);
  return (
    auth && (
      <>
        <ProfileModal
          showProfileModal={showProfileModal}
          handleClose={handleClose}
        />
        <Navbar className={classes.Parent}>
          <Link to="/">
            <Navbar.Brand>
              <i
                className="fab fa-atlassian"
                style={{
                  fontSize: "2.5vw",
                  color: "#871f42",
                  verticalAlign: "middle",
                }}
              ></i>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {pathname !== "/adminDashboard" && (
                <i
                  className="fas fa-user-circle"
                  style={{
                    color: "#871f42",
                    fontSize: "2vw",
                    verticalAlign: "middle",
                    cursor: "pointer",
                  }}
                  onClick={handleShow}
                ></i>
              )}
              &nbsp;
              <span>Hi, {username}</span>
              &nbsp; &nbsp; &nbsp;
              <i
                className="fas fa-sign-out-alt"
                style={{
                  color: "#871f42",
                  fontSize: "1.5vw",
                  verticalAlign: "middle",
                  cursor: "pointer",
                }}
                onClick={() => window.location.reload()}
              ></i>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </>
    )
  );
};
export default Menu;
