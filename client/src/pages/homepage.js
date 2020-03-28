import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./homepage.css";
import axios from "axios";

class Homepage extends React.Component {
  state = {
    email: "",
    password: ""
  };
  handleChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };
  componentDidMount() {
    console.log("isLogin: ", this.props.isLogin);
  }
  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { handleIsLoginChange } = this.props;

    return axios
      .post("http://www.localhost:3000/api/login", {
        email: email,
        password: password
      })
      .then(res => {
        // console.log("res: ", res);
        // console.log("token from local storage: ", localStorage.getItem("auth"));
        // let storageToken = localStorage.getItem("auth");
        let token = "Bearer " + res.data.token;
        // console.log("TOKENNN: ", token);
        // console.log("token from res: ", res.data.token);
        // console.log(
        //   "comparison: ",
        //   localStorage.getItem("auth") === res.data.token
        // );
        if (res.status === 200) {
          axios.defaults.headers.common["Authorization"] = token;
          // localStorage.setItem("auth", "Bearer " + res.data.token);
          // console.log(res);
          handleIsLoginChange(res.data.userID);
          this.props.history.push("/boards");
        }
      })
      .catch(err => {
        console.log(err);
        alert("failed to log in!");
      });
  };
  render() {
    // console.log(isLogin);

    return (
      <div className="fullscreen">
        <span className="Title"> Trello Clone</span>
        <center className="signUpTemplate">
          <h1 style={{ color: "navy" }}>Log In</h1>

          <form onSubmit={this.handleSubmit}>
            <input
              type="email"
              className="EmailBox"
              placeholder={"Enter Email"}
              value={this.state.email}
              onChange={this.handleChange("email")}
            />
            <div>
              <input
                type="password"
                className="PasswordBox"
                placeholder={"Enter Password"}
                value={this.state.password}
                onChange={this.handleChange("password")}
              />
            </div>
            <button className="LoginButton" type="submit">
              Log In!
            </button>
            <div className="Or">OR</div>

            <button
              className="SignUpButton"
              type="submit"
              onClick={() => {
                this.props.history.push("/signup");
              }}
            >
              Sign Up!
            </button>
          </form>
        </center>
      </div>
    );

    // else if (isLogin === true) {
    //   return <div>Successfully logged in!</div>;
    // }
    // console.log("HomeIsLogoin", isLogin);
  }
}
export default withRouter(Homepage);
