import React from "react";
import PropTypes from "prop-types";
//this is the container
import axios from "axios";

export default class Droppable extends React.Component {
  constructor(props) {
    super(props);
  }
  drop = async e => {
    e.preventDefault();
    const data = e.dataTransfer.getData("transfer");
    e.target.appendChild(document.getElementById(data));

    await axios
      .post("http://www.localhost:3000/api/changeCardPosition", {
        cardID: data,
        containerID: this.props.id
      })
      .then(res => {});
  };
  allowDrop = e => {
    e.preventDefault();
  };
  render() {
    return (
      <div
        id={this.props.id}
        onDrop={this.drop}
        onDragOver={this.allowDrop}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}

Droppable.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};
