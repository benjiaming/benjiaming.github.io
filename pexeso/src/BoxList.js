import React, { Component } from "react";
import "./Box.css";

class Box extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.props.onClick(this.props.square, this.props.id);
  }
  render() {
    const { square, loaded, theme } = this.props;
    const imgStyle = {
      maxWidth: "100%",
      maxHeight: "100%"
    };
    const image = <img src={square.image} style={imgStyle} alt={square.alt || "question"} />;
    let pexesoClass = "pexeso-box " + theme;
    if (square.guessed) {
      pexesoClass += " flip-vertical-right hidden";
    }
    return (
      <div className={pexesoClass} onClick={this.handleClick}>
        {loaded && square.shown ? (
          image
        ) : (
          <i className="far fa-question-circle question" />
        )}
      </div>
    );
  }
}

class BoxList extends Component {
  render() {
    const { rowLen, squares, loaded, onClick } = this.props;
    const boxRow = (rowLen, row) =>
      [...Array(rowLen)].fill().map((r, colNum) => {
        const key = row + colNum * rowLen;
        return loaded ? (
          <Box
            key={key}
            id={key}
            square={squares[key]}
            loaded={loaded}
            onClick={onClick}
            theme={this.props.theme}
          />
        ) : (
          undefined
        );
      });
    const boxList = [...Array(rowLen)].fill().map((Null, i) => {
      return (
        <div key={i} className="box-row">
          {boxRow(rowLen, i)}
        </div>
      );
    });
    return <div className="box-list">{loaded ? boxList : "Loading..."}</div>;
  }
}

export default BoxList;
