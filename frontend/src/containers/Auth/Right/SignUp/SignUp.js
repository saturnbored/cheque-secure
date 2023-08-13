import React, { Component } from "react";
import classes from "./SignUp.module.css";
import Form from "react-bootstrap/Form";
import encryptWithServerPublicKey from "../../../../utilities/encrypt";
import { connect } from "react-redux";
import axios from "../../../../chequeAxios";
import loader from "../../../../assets/loader.svg";
import ReCAPTCHA from "react-google-recaptcha";

class SignUp extends Component {
  state = {
    div: 0, // div number
    username: "",
    password: "",
    cPassword: "",
    name: "",
    contact: "",
    account: "",
    IFSCCode: "",
    usernameLenErr: false,
    passwordLenErr: false,
    cPasswordErr: false,
    firstReqErr: true,
    contactErr: false,
    nameErr: false,
    accountErr: false,
    IFSCCodeErr: false,
    secondReqErr: true,
    accountExistErr: false,
    usernameExistErr: false,
    captchaToken: "",
    loading: false,
  };
  checkVal = (inputName) => {
    if (this.state.div === 0) {
      this.setState({
        firstReqErr:
          this.state.username === "" ||
          this.state.password === "" ||
          this.state.cPassword === "",
      });
      if (inputName === "username") {
        this.setState({ usernameLenErr: this.state.username.length < 4 });
      } else if (inputName === "password") {
        const reg =
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
        console.log(!this.state.password.match(reg));
        this.setState({
          passwordLenErr: !this.state.password.match(reg),
          cPasswordErr: this.state.password !== this.state.cPassword,
        });
      } else if (inputName === "cPassword") {
        this.setState({
          cPasswordErr: this.state.password !== this.state.cPassword,
        });
      }
    } else {
      this.setState({
        secondReqErr:
          this.state.name === "" ||
          this.state.contact === "" ||
          this.state.account === "" ||
          this.state.IFSCCode === "",
      });
      if (inputName === "name") {
        const reg = /[A-Za-z]+/;
        this.setState({ nameErr: !this.state.name.match(reg) });
      } else if (inputName === "contact") {
        const reg = /^\d{10}$/;
        this.setState({ contactErr: !this.state.contact.match(reg) });
      } else if (inputName === "account") {
        const reg = /^\d{15}$/;
        this.setState({ accountErr: !this.state.account.match(reg) });
        // this.setState({ accountErr:  });
      } else if (inputName === "IFSCCode") {
        const reg = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        this.setState({ IFSCCodeErr: !this.state.IFSCCode.match(reg) });
      }
    }
  };
  change = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.checkVal(event.target.name);
    });
  };
  next = async (event) => {
    event.preventDefault();
    if (
      !this.state.usernameLenErr &&
      !this.state.passwordLenErr &&
      !this.state.cPasswordErr &&
      !this.state.firstReqErr
    ) {
      this.setState({ loading: true });
      const usernameDoesNotExists = await axios.get(
        "/api/checkUsernameExists",
        {
          params: { username: this.state.username },
        }
      );
      if (usernameDoesNotExists.data) {
        this.setState({ div: 1, usernameExistErr: false });
      } else {
        this.setState({ usernameExistErr: true });
      }
      this.setState({ loading: false });
    }
  };
  submit = async (event) => {
    this.setState({ loading: true });
    event.preventDefault();
    console.log(this.state.captchaToken);
    const captchaRes = await axios.post("/api/captchaVerification", {
      token: this.state.captchaToken,
    });
    console.log(captchaRes.data);
    if (captchaRes.data.success) {
      if (
        !this.state.nameErr &&
        !this.state.accountErr &&
        !this.state.contactErr &&
        !this.state.IFSCCodeErr &&
        !this.state.secondReqErr
      ) {
        const accountExists = await axios.get("/api/checkAccountNumber", {
          params: {
            accountNumber: this.state.account,
          },
        });
        console.log(accountExists.data);
        if (accountExists.data) {
          const data = {
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
            mobileNumber: this.state.contact,
            accountNumber: this.state.account,
            ifscCode: this.state.IFSCCode,
          };
          console.log('key', this.props.server_public_key);
          encryptWithServerPublicKey(data, this.props.server_public_key).then(
            (encryptedData) => {
              console.log('encrypted', encryptedData);
              const req = async () => {
                const res = await axios.post("/api/signUp", {
                  obj: encryptedData,
                });
                console.log('here');
                console.log(res.data);
                if (res.data) {
                  this.props.changeAuthMethod();
                }
              };
              req();
            }
          ).catch(err => {
            console.log(err);
          });
        } else {
          this.setState({ accountExistErr: true, div: 0 });
        }
      }
    }
    this.setState({ loading: false });
  };
  onChangeCaptcha = (value) => {
    this.setState({ captchaToken: value });
  };
  render() {
    return (
      <>
        <h1>Welcome to Apna Cheques!</h1>
        {this.state.loading ? (
          <img
            src={loader}
            alt="loader"
            style={{ display: "block", margin: "10vh auto" }}
          />
        ) : (
          <Form className={classes.SignIn}>
            <p className={classes.P2} onClick={this.props.changeAuthMethod}>
              <i className="fas fa-chevron-left"></i> Already a User?
            </p>
            {this.state.div === 0 && (
              <div>
                {this.state.firstReqErr && (
                  <p className={classes.Error}>*All fields are required</p>
                )}
                {this.state.usernameExistErr && (
                  <p className={classes.Error}>*Username already exists</p>
                )}
                {this.state.accountExistErr && (
                  <p className={classes.Error}>*Bank Account does not exist</p>
                )}
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    className={classes.Input}
                    autoFocus
                    name="username"
                    onChange={this.change}
                    value={this.state.username}
                  />
                  {this.state.usernameLenErr && (
                    <p className={classes.Error}>
                      *Username must be of atleast 4 characters
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className={classes.Input}
                    name="password"
                    onChange={this.change}
                    value={this.state.password}
                  />
                  {this.state.passwordLenErr && (
                    <p className={classes.Error}>
                      *Password must contain atleast 8 characters, one uppercase
                      letter, one lowercase letter, one number and one special
                      character.
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBasicCPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    className={classes.Input}
                    name="cPassword"
                    onChange={this.change}
                    value={this.state.cPassword}
                  />
                  {this.state.cPasswordErr && (
                    <p className={classes.Error}>
                      *Confirm Password must match Password
                    </p>
                  )}
                </Form.Group>
                <button className={classes.Button} onClick={this.next}>
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
            {this.state.div === 1 && (
              <div>
                {this.state.secondReqErr && (
                  <p className={classes.Error}>*All fields are required</p>
                )}
                <Form.Group className="mb-4" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="What shall we call you?"
                    className={classes.Input}
                    autoFocus
                    name="name"
                    onChange={this.change}
                    value={this.state.name}
                  />
                  {this.state.nameErr && (
                    <p className={classes.Error}>*Invalid name</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="number">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="We need it to contact you!"
                    className={classes.Input}
                    name="contact"
                    onChange={this.change}
                    value={this.state.contact}
                  />
                  {this.state.contactErr && (
                    <p className={classes.Error}>*Invalid Phone Number</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="account">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Account Number"
                    className={classes.Input}
                    name="account"
                    onChange={this.change}
                    value={this.state.account}
                  />
                  {this.state.accountErr && (
                    <p className={classes.Error}>*Invalid Account Number</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="ifsc">
                  <Form.Label>IFSC Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Okay, Last One!"
                    className={classes.Input}
                    name="IFSCCode"
                    onChange={this.change}
                    value={this.state.IFSCCode}
                  />
                  {this.state.IFSCCodeErr && (
                    <p className={classes.Error}>*Invalid IFSC Code</p>
                  )}
                </Form.Group>
                <ReCAPTCHA
                  sitekey="6LeoqZ8nAAAAAJMiMMKhVWAQ7ovG7uq50oSAVyRh"
                  onChange={this.onChangeCaptcha}
                  size="normal"
                />
                <p
                  className={classes.P2}
                  onClick={() => this.setState({ div: 0 })}
                >
                  <i className="fas fa-chevron-left"></i> Back
                </p>

                <button
                  className={classes.Button}
                  onClick={this.submit}
                  type="submit"
                >
                  Submit <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </Form>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { server_public_key: state.key };
};

export default connect(mapStateToProps)(SignUp);
