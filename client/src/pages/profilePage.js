import React from "react";
import { withRouter } from "react-router-dom";
import "./profilePage.css";
import axios from "axios";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      newName: "",
      email: "",
      newEmail: "",
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    };
  }
  handleChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { newName, newEmail, newPassword } = this.state;

    return axios
      .post("http://www.localhost:3000/api/editUserInfo", {
        id: this.props.userID,
        name: newName || this.state.name,
        email: newEmail || this.state.email,
        password: newPassword || this.state.password
      })
      .then(res => {
        console.log("res: ", res);
        if (res.status === 200) {
          this.setState({
            name: newName || this.state.name,
            email: newEmail || this.state.email,
            password: newPassword || this.state.password
          });
          alert("Info Changed!");
        }
      })
      .catch(err => console.log(err));
  };

  handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      return axios
        .post("http://www.localhost:3000/api/deleteAccount", {
          id: this.props.userID
        })
        .then(res => {
          console.log("delete account res: ", res);
          if (res.status === 200) {
            this.props.handleLogout();
            this.props.history.push("/");
          } else {
            console.log("failed to delete account");
          }
        });
    }
  };

  componentDidMount = async () => {
    await axios
      .post("http://www.localhost:3000/api/getUser", { id: this.props.userID })
      .then(res => {
        console.log("res: ", res);
        const { name, email, password } = res.data.user;
        this.setState({
          name: name,
          email: email,
          password: password
        });
        console.log("state name: ", this.state.name);
        console.log("state email: ", this.state.email);
        console.log("state password: ", this.state.password);
        console.log("state boards: ", this.state.boards);
      });
  };
  render() {
    const { isLogin } = this.props;
    if (isLogin === true) {
      return (
        <div className="boardsfullscreen">
          <span className="boardsTitleThree"> Trello Clone</span>
          <span
            className="boardsTabthree tabHover"
            onClick={() => {
              this.props.history.push("/boards");
            }}
          >
            Boards
          </span>
          <span
            className="myBoardTabthree tabHover"
            onClick={() => {
              this.props.history.push("/containers");
            }}
          >
            My Board
          </span>
          <span className="profileTabthree">Profile</span>
          <center className="boardsTemplatethree">
            <form onSubmit={this.handleSubmit}>
              <div>
                <span className="doodad">Current Name: </span>
                <input
                  className="inputName"
                  placeholder={this.state.name}
                  // value={this.state.name}
                  onChange={this.handleChange("newName")}
                ></input>
                <button className="buttonName">Change</button>
              </div>
              <div>
                <span className="doodad">Current Email: </span>
                <input
                  className="inputEmail"
                  type="email"
                  placeholder={this.state.email}
                  // value={this.state.email}
                  onChange={this.handleChange("newEmail")}
                ></input>
                <button className="buttonEmail">Change</button>
              </div>
              <div>
                <span className="doodad">Current Password: </span>
                <input
                  className="inputPassword"
                  placeholder={this.state.password}
                  // value={this.state.password}
                  onChange={this.handleChange("newPassword")}
                ></input>
                <button className="buttonPassword">Change</button>
              </div>
            </form>
            <div>
              <button
                className="buttonLogout"
                onClick={() => {
                  this.props.handleLogout();
                  this.props.history.push("/");
                }}
              >
                Logout
              </button>
            </div>
            <div>
              <button className="buttonDelete" onClick={this.handleDelete}>
                Delete Account
              </button>
            </div>
          </center>
        </div>
      );
    } else {
      return <div>Oops, please login!</div>;
    }
  }
}

export default withRouter(ProfilePage);
