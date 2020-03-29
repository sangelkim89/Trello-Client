import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./homepage.css";
import axios from "axios";
require("dotenv").config();

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

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { handleIsLoginChange } = this.props;

    return axios
      .post(process.env.REACT_APP_ENDPOINT + "/api/login", {
        email: email,
        password: password
      })
      .then(res => {
        let token = "Bearer " + res.data.token;
        if (res.status === 200) {
          axios.defaults.headers.common["Authorization"] = token;
          handleIsLoginChange(res.data.userID);
          this.props.history.push("/boards");
        }
      })
      .catch(err => {
        alert("failed to log in!");
      });
  };
  render() {
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
  }
}
export default withRouter(Homepage);
