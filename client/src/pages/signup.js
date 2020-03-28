import React from "react";
import { withRouter, Link, useHistory } from "react-router-dom";
import axios from "axios";
import "./signup.css";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    this.handleInputValue = this.handleInputValue.bind(this);
    // axios.defaults.withCredentials = false;
  }
  handleInputValue = key => e => {
    this.setState({ [key]: e.target.value });
  };
  render() {
    const { username, email, password, confirmPassword } = this.state;
    return (
      <div className="fullscreen">
        <div className="Title"> Trello Clone</div>
        <center className="signUpTemplate">
          <h1 style={{ color: "navy" }}>Sign Up</h1>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (password === confirmPassword) {
                axios
                  .post("http://www.localhost:3000/api/signup", {
                    name: username,
                    email: email,
                    password: password
                  })
                  .then(res => {
                    if (res.status === 200) {
                      console.log("user created!");
                      this.props.history.push("/");
                    }
                  })
                  .catch(err => {
                    alert("Email already exists");
                  });
              } else {
                console.log("Confirm Password must match!");
              }
            }}
          >
            <div>
              <input
                className="NameBox"
                type="username"
                placeholder="Enter Full Name"
                onChange={this.handleInputValue("username")}
              ></input>
            </div>
            <div>
              <input
                className="EmailBoxTwo"
                type="email"
                placeholder="Enter Email"
                onChange={this.handleInputValue("email")}
              ></input>
            </div>
            <div>
              <input
                className="PasswordBoxTwo"
                onChange={this.handleInputValue("password")}
                type="password"
                placeholder="Enter Password"
              ></input>
            </div>
            <div>
              <input
                className="ConfirmPasswordBox"
                onChange={this.handleInputValue("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
              ></input>
            </div>
            <button
              className="CreateButton"
              type="submit"
              // onClick={() => {
              //   this.props.history.push("/");
              // }}
            >
              Create Account!
            </button>
          </form>
        </center>
      </div>
    );
  }
}

export default withRouter(Signup);
