import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./containersPage.css";
import axios from "axios";
import Container from "./container";
import Card from "./card";

class ContainersPage extends React.Component {
  state = {
    boards: [],
    newContainerName: "",
    newCardName: "",
    board: {},
    containers: [],
    cards: [],
    addToggled: false
  };

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };
  getName = () => {
    let name = this.state.board;
    if (name === undefined) {
      return "Create/Choose A Board First!";
    } else {
      return this.state.board.name;
    }
  };
  addContainer = async e => {
    e.preventDefault();
    const { newContainerName } = this.state;
    if (newContainerName === "") {
      alert("You must enter a container name!");
    } else {
      let boardInQuestion = () => {
        for (let i = 0; i < this.state.boards.length; i++) {
          console.log("cycling thru boards: ", this.state.boards[i]);
          if (this.state.boards[i]._id === this.props.selectedBoardID) {
            console.log("found board!!!: ", this.state.boards[i]);
            return this.state.boards[i];
          }
        }
      };
      let boardIndex = this.state.boards.indexOf(boardInQuestion());

      // let updatedBoard = this.state.boards[0].push({});
      await axios
        .post("http://www.localhost:3000/api/containerCreate", {
          boardID: this.props.selectedBoardID,
          name: newContainerName
        })
        .then(res => {
          this.setState({ containers: res.data.containers });
          document.getElementById("containerNameInput").value = null;
          console.log("container creation server response: ", res);
          console.log("boards after container create: ", this.state.boards);
          // let currentBoard = this.state.boards;
          // console.log("currentBoard: ", currentBoard);
          // currentBoard.push({
          //   name: this.state.newBoardName
          // });
          // console.log("addBoard res: ", res);
          // this.setState({ boards: currentBoard });
        })
        .catch(err => console.log(err));
    }
  };

  handleAddCardWithName = containerID => async e => {
    e.preventDefault();

    let containerInQuestion = () => {
      for (let i = 0; i < this.state.board.container.length; i++) {
        if (this.state.board.container[i]._id === containerID) {
          return this.state.board.container[i];
        }
      }
    };
    let containerIndex = this.state.board.container.indexOf(
      containerInQuestion()
    );
    // console.log("containerIndex: ", containerIndex);

    await axios
      .post("http://www.localhost:3000/api/cardCreate", {
        userID: this.props.userID,
        boardID: this.props.selectedBoardID,
        containerID: containerID,
        name: this.state.newCardName,
        containerIndex: containerIndex
      })
      .then(res => {
        console.log("card creation res: ", res);

        // const currentState = this.state.addToggled;
        this.setState({ cards: res.data.cards });
      });
  };
  deleteContainer = containerID => async e => {
    e.stopPropagation();
    await axios
      .post("http://www.localhost:3000/api/containerDelete", {
        boardID: this.props.selectedBoardID,
        containerID: containerID
      })
      .then(res => {
        console.log("deleteContainer res: ", res);

        this.setState({ containers: res.data.containers });
      });
  };
  deleteCard = (cardID, containerID) => async e => {
    e.stopPropagation();
    await axios
      .post("http://www.localhost:3000/api/cardDelete", {
        containerID: containerID,
        cardID: cardID
      })
      .then(res => {
        console.log("deleteCard res: ", res);
        this.setState({ cards: res.data.cards });
      });
  };
  componentDidMount = async () => {
    console.log("selected Board ID: ", this.props.selectedBoardID);
    await axios
      .post("http://www.localhost:3000/api/getUser", { id: this.props.userID })
      .then(res => {
        console.log("didmount res: ", res);
        const { boards } = res.data.user;

        this.setState({
          boards: boards
        });

        let boardInQuestion = () => {
          for (let i = 0; i < this.state.boards.length; i++) {
            console.log("cycling thru boards: ", this.state.boards[i]);
            if (this.state.boards[i]._id === this.props.selectedBoardID) {
              console.log("found board!!!: ", this.state.boards[i]);
              return this.state.boards[i];
            }
          }
        };
        let boardIndex = this.state.boards.indexOf(boardInQuestion());
        console.log("index: ", boardIndex);
        let board = this.state.boards[boardIndex];
        console.log("board: ", board);
        this.setState({ board: board });
        console.log("this.state.board: ", this.state.board);

        // console.log("this.state.boards", this.state.boards);
        // console.log("this.state.board: ", this.state.board);

        // console.log("single board: ", board);

        // console.log("state boards: ", this.state.boards);
        // console.log(
        //   "index test: ",
        //   this.state.boards.indexOf(boardInQuestion())
        // );
      });
    await axios.get("http://www.localhost:3000/api/getCards").then(res => {
      console.log("getCards res: ", res);
      this.setState({ cards: res.data.cards });
      console.log("cards state: ", this.state.cards);
    });
    await axios.get("http://www.localhost:3000/api/getContainers").then(res => {
      this.setState({ containers: res.data.containers });
      console.log("containers state: ", this.state.containers);
    });
  };
  render() {
    const { isLogin } = this.props;
    if (isLogin === true) {
      // const cont = this.state.board.container;
      // console.log(
      //   "this.state.board.container type: ",
      //   typeof this.state.board.container
      // );
      // console.log("this.state.board.container: ", this.state.board.container);
      let boardInQuestion = () => {
        for (let i = 0; i < this.state.boards.length; i++) {
          console.log("cycling thru boards: ", this.state.boards[i]);
          if (this.state.boards[i]._id === this.props.selectedBoardID) {
            console.log("found board!!!: ", this.state.boards[i]);
            return this.state.boards[i];
          }
        }
      };

      let boardIndex = this.state.boards.indexOf(boardInQuestion());
      console.log("index: ", boardIndex);
      let containers = this.state.containers;
      // console.log("board: ", board);
      return (
        <div className="boardsfullscreen">
          <span className="boardsTitleTwo"> Trello Clone</span>
          <span
            className="boardsTabtwo tabHover"
            onClick={() => {
              this.props.history.push("/boards");
            }}
          >
            Boards
          </span>
          <span className="myBoardTabtwo">My Board</span>
          <span
            className="profileTabtwo tabHover"
            onClick={() => {
              this.props.history.push("/profile");
            }}
          >
            Profile
          </span>
          <div className="boardsTemplatetwo">
            <span className="indicator">Current Board: {this.getName()}</span>
            <form onSubmit={this.addContainer}>
              <div className="addContainerBox">
                <div>
                  <input
                    id="containerNameInput"
                    placeholder={"Type Container Name Here"}
                    value={this.state.newContainerName}
                    onChange={this.handleChange("newContainerName")}
                  ></input>
                </div>
                <button
                  className="addContainerButton"
                  type="submit"
                  onClick={() => {
                    document.getElementById("containerNameInput").value = "";
                  }}
                >
                  Add a Container
                </button>
              </div>
            </form>
            {containers.map(container => {
              if (container.boardID === this.props.selectedBoardID) {
                return (
                  <div className="container" key={container._id}>
                    <main className="flexbox">
                      <Container id="board-1" className="containerscroll">
                        <div
                          className="editContainerButton"
                          onClick={async e => {
                            // e.preventDefault();
                            e.stopPropagation();
                            let txt;
                            let newPrompt = prompt(
                              "Please enter new container name:"
                            );
                            if (newPrompt === null || newPrompt === "") {
                              alert("You must enter a new board name.");
                            } else {
                              txt = newPrompt;
                            }
                            console.log(txt);

                            console.log("newPrompt: ", newPrompt);
                            await axios
                              .post(
                                "http://www.localhost:3000/api/containerEdit",
                                {
                                  boardID: this.props.selectedBoardID,
                                  containerID: container._id,
                                  newContainerName: txt
                                }
                              )
                              .then(res => {
                                console.log("re: ", res);
                                if (res.status === 200) {
                                  console.log("sent!!!!!!!!!!!!!!!!! : ", res);
                                  let updatedcontainers = res.data.containers;
                                  this.setState({
                                    containers: updatedcontainers
                                  });
                                }
                              })
                              .catch(err => {
                                console.log(err);
                              });

                            // this.editBoard(board._id, txt);
                            // e.stopPropagation();
                          }}
                        >
                          Edit
                        </div>
                        <div
                          className="containerXbutton"
                          onClick={this.deleteContainer(container._id)}
                        >
                          X
                        </div>
                        <div className="containerName">
                          Container Name: {container.name}
                        </div>

                        <form
                          onSubmit={this.handleAddCardWithName(container._id)}
                        >
                          <input
                            placeholder="Type Card Name Here"
                            key={container._id}
                            className="typeCard"
                            onChange={this.handleChange("newCardName")}
                          ></input>
                          <div
                            className="addCard"
                            onClick={this.handleAddCardWithName(container._id)}
                          >
                            + Add +
                          </div>
                        </form>
                        {this.state.cards.map(card => {
                          if (card.containerID === container._id) {
                            return (
                              <Card
                                id="card_id"
                                key={card._id}
                                className="card"
                                draggable="true"
                              >
                                <div
                                  className="editCardButton"
                                  onClick={async e => {
                                    // e.preventDefault();
                                    e.stopPropagation();
                                    let txt;
                                    let newPrompt = prompt(
                                      "Please enter new container name:"
                                    );
                                    if (
                                      newPrompt === null ||
                                      newPrompt === ""
                                    ) {
                                      alert("You must enter a new board name.");
                                    } else {
                                      txt = newPrompt;
                                    }
                                    console.log(txt);

                                    console.log("newPrompt: ", newPrompt);
                                    await axios
                                      .post(
                                        "http://www.localhost:3000/api/cardEdit",
                                        {
                                          cardID: card._id,
                                          containerID: container._id,
                                          newCardName: txt
                                        }
                                      )
                                      .then(res => {
                                        console.log("re: ", res);
                                        if (res.status === 200) {
                                          console.log(
                                            "sent!!!!!!!!!!!!!!!!! : ",
                                            res
                                          );
                                          this.setState({
                                            cards: res.data.cards
                                          });
                                        }
                                      })
                                      .catch(err => {
                                        console.log(err);
                                      });

                                    // this.editBoard(board._id, txt);
                                    // e.stopPropagation();
                                  }}
                                >
                                  Edit
                                </div>
                                <div
                                  className="cardXbutton"
                                  onClick={this.deleteCard(
                                    card._id,
                                    container._id
                                  )}
                                >
                                  X
                                </div>
                                <p>{card.name}</p>
                              </Card>
                            );
                          }
                        })}
                      </Container>
                    </main>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    } else {
      return <div>Oops, please login!</div>;
    }
  }
}

export default withRouter(ContainersPage);

{
  /* <div className="lists">
            <div className="list">
              <div className="list-item" draggable="true">
                List Item 1
              </div>
            </div>
            <div className="list">
              <div className="list-item" draggable="true">
                List Item 2
              </div>
            </div>
            <div className="list">
              <div className="list-item" draggable="true">
                List Item 3
              </div>
            </div>
          </div> */
}
