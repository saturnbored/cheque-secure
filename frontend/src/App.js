import "./App.css";
import Footer from "./components/Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Menu from "./components/Menu/Menu";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "./chequeAxios";
import generateClientKeyPair from "./utilities/generateClientKeyPair";
import React, { Component, Suspense } from "react";
import loader from "./assets/loader.svg";

const Auth = React.lazy(() =>
  new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
    import("./containers/Auth/Auth")
  )
);

const ChequeVerify = React.lazy(() =>
  new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
    import("./containers/ChequeVerify/ChequeVerify")
  )
);

const CustomerDashboard = React.lazy(() =>
  new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
    import("./containers/CustomerDashboard/CustomerDashboard")
  )
);

const AdminDashboard = React.lazy(() =>
  new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
    import("./containers/AdminDashboard/AdminDashboard")
  )
);

class App extends Component {
  componentDidMount() {

    sessionStorage.clear();
    setTimeout(() => {
      window.location.reload();
    }, 3600000);
    
    axios.get("/api/getPublicKey").then((res) => {
      this.props.setServerPublicKey(res.data);
    });

    generateClientKeyPair().then((clientPublicKey) => {
      this.props.setClientPublicKey(clientPublicKey);
    });
  
  }

  render() {
    return (
      <div className="App">
        {this.props.location.pathname !== "/auth" &&
          this.props.location.pathname !== "/admin" && <Menu />}
        <Suspense
          fallback={
            <img
              src={loader}
              alt="loader"
              style={{ display: "block", margin: "30vh auto" }}
            />
          }
        >
          <Switch>
            <Route path="/chequeVerify" component={ChequeVerify} />
            <Route path="/adminDashboard" component={AdminDashboard} />
            <Route path="/auth" component={Auth} />
            <Route path="/admin" component={Auth} />
            <Route path="/" component={CustomerDashboard} />
            <Route path="*" component={Auth} />
          </Switch>
        </Suspense>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setServerPublicKey: (key) =>
      dispatch({ type: "SET_SERVER_PUBLIC_KEY", key: key }),
    setClientPublicKey: (key) =>
      dispatch({ type: "SET_CLIENT_PUBLIC_KEY", key: key }),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(App));
