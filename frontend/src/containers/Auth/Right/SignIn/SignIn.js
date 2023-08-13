import React, { Component } from "react";
import encryptWithServerPublicKey from "../../../../utilities/encrypt";
import classes from "./SignIn.module.css";
import { connect } from "react-redux";
import axios from "../../../../chequeAxios";
import Form from "react-bootstrap/Form";
// import decrypt from "../../../../utilities/decrypt";
import { withRouter } from "react-router";
import loader from "../../../../assets/loader.svg";
import ReCAPTCHA from "react-google-recaptcha";

class SignIn extends Component {
  state = {
    username: "",
    password: "",
    loading: false,
    error: false,
  };
  change = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  submit = (event) => {
    this.setState({ loading: true });
    if (this.state.username !== "" && this.state.password !== "") {
      event.preventDefault();
      const data = {
        username: this.state.username,
        password: this.state.password,
      };
      encryptWithServerPublicKey(data, this.props.server_public_key).then(
        (encryptedData) => {
          if (this.props.location.pathname === "/auth") {
            const req = async () => {
              const res = await axios
                .post("/api/login", {
                  obj: encryptedData,
                  public_key: this.props.clientPublicKey,
                })
                .catch((err) => {
                  console.log(err);
                });
              if (res && res.data) {
                // decrypt(res.data.encrypted_aes_key).then((decryptedData) => {
                //   console.log(JSON.parse(decryptedData));
                // });
                console.log(res.data);
                sessionStorage.setItem(
                  "token",
                  JSON.stringify(res.data.accessToken)
                );
                const user = {
                  mobileNumber: res.data.user.mobileNumber,
                  name: res.data.user.name,
                  username: res.data.user.username,
                };
                this.setState({ loading: false });
                this.props.setAuthTrue(user);
                this.props.setAesKey(res.data.user.encrypted_aes_key);
                this.props.history.push("/");
              } else {
                this.setState({ error: true, loading: false });
              }
            };
            req();
          } else {
            const req = async () => {
              const res = await axios
                .post("/api/adminLogin", {
                  obj: encryptedData,
                  public_key: this.props.clientPublicKey,
                })
                .catch((err) => {
                  console.log(err);
                });
              if (res && res.data) {
                // decrypt(res.data.encrypted_aes_key).then((decryptedData) => {
                //   console.log(JSON.parse(decryptedData));
                // });
                sessionStorage.setItem(
                  "token",
                  JSON.stringify(res.data.accessToken)
                );
                console.log(res.data);
                const user = {
                  name: "",
                  username: res.data.username,
                };
                this.setState({ loading: false });
                this.props.setAuthTrue(user);
                this.props.setAesKey(res.data.encrypted_aes_key);
                this.props.history.push("/adminDashboard");
              } else {
                this.setState({ error: true, loading: false });
              }
            };
            req();
          }
        }
      );
    }
  };
  render() {
    console.log(this.props.location.pathname);
    return this.state.loading ? (
      <img
        src={loader}
        alt="loader"
        style={{ display: "block", margin: "10vh auto" }}
      />
    ) : (
      <>
        {this.props.location.pathname === "/auth" ? (
          <h1>Sign In to Apna Cheques</h1>
        ) : null}
        {this.props.location.pathname === "/admin" ? (
          <h1>Log In as Admin</h1>
        ) : null}
        <Form className={classes.SignIn}>
          {this.state.error && (
            <p style={{ color: "#dc3546" }}>*Invalid credentials</p>
          )}
          <p style={{ color: "#dc3546" }}>*All fields are required</p>
          <Form.Group className="mb-4" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Enter username"
              className={classes.Input}
              autoFocus
              name="username"
              value={this.state.username}
              onChange={this.change}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="Password"
              className={classes.Input}
              name="password"
              value={this.state.password}
              onChange={this.change}
              minLength="7"
            />
          </Form.Group>
          <ReCAPTCHA
            sitekey="6LeoqZ8nAAAAAJMiMMKhVWAQ7ovG7uq50oSAVyRh"
            onChange={this.onChangeCaptcha}
            size="normal"
          />
          {this.props.location.pathname === "/auth" ? (
            <p className={classes.P} onClick={this.props.changeAuthMethod}>
              New User?
            </p>
          ) : null}
          <button
            className={classes.Button}
            type="submit"
            onClick={this.submit}
          >
            Sign In <i className="fas fa-chevron-right"></i>
          </button>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    server_public_key: state.key,
    clientPublicKey: state.clientPublicKey,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthTrue: (user) => dispatch({ type: "True_Auth", user: user }),
    setAesKey: (key) => dispatch({ type: "SET_AES_KEY", key: key }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));
