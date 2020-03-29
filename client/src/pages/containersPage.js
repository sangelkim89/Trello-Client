import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./containersPage.css";
import axios from "axios";
import styled from "styled-components";
import Droppable from "./Droppable";
import Draggable from "./Draggable";

const Wrapper = styled.div`
  margin-left: 80px;
  padding: 32px;
  float: left;
`;
const Item = styled.div`
  padding: 8px;
  color: #555;
  background-color: white;
  border-radius: 10px;
  border: 1px solid black;
`;
const droppableStyle = {
  float: "left",
  backgroundColor: "lightgray",
  width: "250px",
  height: "300px",
  margin: "32px",
  overflowY: "auto",
  borderRadius: "10px",
  border: "1px solid darkblue"
};

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
      await axios
        .post("http://www.localhost:3000/api/containerCreate", {
          boardID: this.props.selectedBoardID,
          name: newContainerName,
          userID: this.props.userID
        })
        .then(res => {
          this.setState({ containers: res.data.containers });
          document.getElementById("containerNameInput").value = null;
        })
        .catch(err => alert(err));
    }
  };

  handleAddCardWithName = containerID => async e => {
    e.preventDefault();

    await axios
      .post("http://www.localhost:3000/api/cardCreate", {
        userID: this.props.userID,
        boardID: this.props.selectedBoardID,
        containerID: containerID,
        name: this.state.newCardName
      })
      .then(res => {
        this.setState({ cards: res.data.cards });
        document.getElementById("cardNameInput").value = null;
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
        this.setState({ containers: res.data.containers });
      });
  };
  deleteCard = (cardID, containerID) => async e => {
    e.stopPropagation();
    await axios
      .post("http://www.localhost:3000/api/cardDelete", {
        cardID: cardID
      })
      .then(res => {
        // let card = document.getElementById(cardID);
        // card.style.display = "none";
        // card.remove();

        this.setState({ cards: res.data.cards });
      });
  };

  componentDidMount = async () => {
    await axios
      .post("http://www.localhost:3000/api/getUser", { id: this.props.userID })
      .then(res => {
        const { boards } = res.data.user;

        this.setState({
          boards: boards
        });

        let boardInQuestion = () => {
          for (let i = 0; i < this.state.boards.length; i++) {
            if (this.state.boards[i]._id === this.props.selectedBoardID) {
              return this.state.boards[i];
            }
          }
        };
        let boardIndex = this.state.boards.indexOf(boardInQuestion());
        let board = this.state.boards[boardIndex];
        this.setState({ board: board });
      });
    await axios.get("http://www.localhost:3000/api/getCards").then(res => {
      this.setState({ cards: res.data.cards });
    });
    await axios.get("http://www.localhost:3000/api/getContainers").then(res => {
      this.setState({ containers: res.data.containers });
    });
  };
  render() {
    const { isLogin } = this.props;
    if (isLogin === true) {
      let containers = this.state.containers;
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

            {containers.map((container, i) => {
              if (container.boardID === this.props.selectedBoardID) {
                return (
                  <Wrapper key={i}>
                    <Droppable id={container._id} style={droppableStyle}>
                      <div
                        className="editContainerButton"
                        onClick={async e => {
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
                              if (res.status === 200) {
                                let updatedcontainers = res.data.containers;
                                this.setState({
                                  containers: updatedcontainers
                                });
                              }
                            })
                            .catch(err => {
                              alert(err);
                            });
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
                      <div
                        className="containerName"
                        style={{ fontWeight: "bold" }}
                      >
                        Container Name: {container.name}
                      </div>
                      <form
                        onSubmit={this.handleAddCardWithName(container._id)}
                      >
                        <input
                          id="cardNameInput"
                          placeholder="Type Card Name Here"
                          key={container._id}
                          className="typeCard"
                          onChange={this.handleChange("newCardName")}
                        ></input>
                        <div
                          className="addCard"
                          onClick={this.handleAddCardWithName(container._id)}
                        >
                          + Add Card +
                        </div>
                      </form>
                      {this.state.cards.map((card, i) => {
                        if (card.containerID === container._id) {
                          return (
                            <Draggable
                              id={card._id}
                              style={{ margin: "8px" }}
                              key={i}
                            >
                              <div
                                className="editCardButton"
                                onClick={async e => {
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
                                      if (res.status === 200) {
                                        this.setState({
                                          cards: res.data.cards
                                        });
                                      }
                                    })
                                    .catch(err => {
                                      alert(err);
                                    });
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
                              <Item>{card.name}</Item>
                            </Draggable>
                          );
                        }
                      })}
                    </Droppable>
                  </Wrapper>
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
