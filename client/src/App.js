import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import Homepage from "../src/pages/homepage";
import Signup from "../src/pages/signup";
import BoardsPage from "../src/pages/boardsPage";
import ContainersPage from "../src/pages/containersPage";
import ProfilePage from "../src/pages/profilePage";

// axios.defaults.withCredentials = false;
class App extends React.Component {
  state = {
    isLogin: localStorage.getItem("isLogin") || false,
    userID: localStorage.getItem("userID") || "",
    selectedBoardID: localStorage.getItem("selectedBoardID") || "",
    boards: localStorage.getItem("boards") || []
  };
  handleIsLoginChange = userID => {
    localStorage.setItem("isLogin", true);
    localStorage.setItem("userID", userID);
    this.setState({ isLogin: true, userID: userID });
  };
  handleBoardSelect = n => {
    localStorage.setItem("selectedBoardID", n);
    this.setState({ selectedBoardID: n });
  };
  handleUploadBoard = n => {
    localStorage.setItem("boards", n);
    this.setState({ boards: n });
    console.log("boards state in APP.JS after upload: ", this.state.boards);
  };
  handleLogout = () => {
    console.log("logging out...");
    localStorage.setItem("isLogin", false);
    this.setState({ isLogin: false, userID: "" });
  };

  render() {
    const { isLogin, userID, selectedBoardID } = this.state;
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <Homepage
                  isLogin={isLogin}
                  handleIsLoginChange={this.handleIsLoginChange}
                />
              );
            }}
          />

          <Route
            exact
            path="/signup"
            render={() => <Signup isLogin={isLogin} />}
          />
          <Route
            exact
            path="/boards"
            render={() => (
              <BoardsPage
                isLogin={isLogin}
                userID={userID}
                handleBoardSelect={this.handleBoardSelect}
                handleUploadBoard={this.handleUploadBoard}
              />
            )}
          />
          <Route
            exact
            path="/containers"
            render={() => (
              <ContainersPage
                userID={this.state.userID}
                isLogin={isLogin}
                userID={userID}
                selectedBoardID={selectedBoardID}
                boards={this.state.boards}
              />
            )}
          />
          <Route
            exact
            path="/profile"
            render={() => (
              <ProfilePage
                isLogin={isLogin}
                userID={userID}
                handleLogout={this.handleLogout}
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
