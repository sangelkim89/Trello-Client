import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./boardsPage.css";
import axios from "axios";
class BoardsPage extends React.Component {
  state = {
    newBoardName: "",
    name: "",
    email: "",
    password: "",
    boards: []
  };
  handleChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };
  addBoard = async e => {
    e.preventDefault();
    const { newBoardName } = this.state;
    if (newBoardName === "") {
      alert("You must enter a board name!");
    } else {
      await axios
        .post("http://www.localhost:3000/api/boardCreate", {
          userID: this.props.userID,
          newBoardName: newBoardName
        })
        .then(res => {
          if (res.status === 201) {
            alert("Board name already exists!");
          } else {
            let currentBoard = this.state.boards;
            currentBoard.push({
              name: this.state.newBoardName
            });
            let newboards = res.data.user.boards;
            this.setState({ boards: newboards });
            document.getElementById("boardNameInput").value = null;
          }
        })
        .catch(err => alert(err));
    }
  };
  deleteBoard = boardID => async e => {
    e.stopPropagation();
    await axios
      .post("http://www.localhost:3000/api/boardDelete", {
        userID: this.props.userID,
        boardID: boardID
      })
      .then(res => {
        let resboard = res.data.user.boards;
        this.setState({ boards: resboard });
      });
  };
  editBoard = (boardID, newPrompt) => async e => {
    e.stopPropagation();
    await axios.post("http://www.localhost:3000/api/boardEdit", {
      userID: this.props.userID,
      boardID: boardID,
      newBoardName: newPrompt
    });
  };
  componentDidMount = async () => {
    await axios
      .post("http://www.localhost:3000/api/getUser", { id: this.props.userID })
      .then(res => {
        const { name, email, password, boards } = res.data.user;
        this.props.handleUploadBoard(res.data.user.boards);
        this.setState({
          name: name,
          email: email,
          password: password,
          boards: boards
        });
      });
  };
  render() {
    const { isLogin } = this.props;
    const boardies = this.state.boards;
    if (isLogin === true) {
      return (
        <div className="boardsfullscreen">
          <span className="boardsTitle"> Trello Clone</span>
          <span className="boardsTab">Boards</span>
          <span
            className="myBoardTab tabHover"
            onClick={() => {
              this.props.history.push("/containers");
            }}
          >
            My Board
          </span>
          <span
            className="profileTab tabHover"
            onClick={() => {
              this.props.history.push("/profile");
            }}
          >
            Profile
          </span>
          <div className="boardsTemplate">
            <form onSubmit={this.addBoard}>
              <div className="addBoardBox">
                <div>
                  <input
                    id="boardNameInput"
                    placeholder={"Type Board Name Here"}
                    value={this.state.newBoardName}
                    onChange={this.handleChange("newBoardName")}
                  ></input>
                </div>
                <button
                  className="addBoardButton"
                  type="submit"
                  onClick={() => {
                    document.getElementById("boardNameInput").value = "";
                  }}
                >
                  Add a Board
                </button>
              </div>
            </form>

            {boardies &&
              boardies.map(board => {
                return (
                  <>
                    <div
                      className="board"
                      key={board._id}
                      onClick={() => {
                        this.props.handleBoardSelect(board._id);
                        this.props.history.push("/containers");
                      }}
                    >
                      <div
                        className="xbutton"
                        onClick={this.deleteBoard(board._id)}
                      >
                        X
                      </div>
                      <div>Start Using Board:</div>
                      <div className="boardTitle">{board.name}</div>
                      <div
                        className="editButton"
                        onClick={async e => {
                          e.stopPropagation();
                          let txt;
                          let newPrompt = prompt(
                            "Please enter new board name:"
                          );
                          if (newPrompt === null || newPrompt === "") {
                            alert("You must enter a new board name.");
                          } else {
                            txt = newPrompt;
                          }
                          await axios
                            .post("http://www.localhost:3000/api/boardEdit", {
                              userID: this.props.userID,
                              boardID: board._id,
                              newBoardName: txt
                            })
                            .then(res => {
                              if (res.status === 201) {
                                alert("That name is already taken!");
                              } else if (res.status === 200) {
                                let updatedboards = res.data.user.boards;
                                this.setState({ boards: updatedboards });
                              }
                            })
                            .catch(err => {
                              alert(err);
                            });
                        }}
                      >
                        Edit
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      );
    } else {
      return <div>Oops, please login!</div>;
    }
  }
}
export default withRouter(BoardsPage);
