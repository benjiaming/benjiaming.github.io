import React from "react";
import ReactDOM from "react-dom";
import Pexeso from "./Pexeso";
import Game from "./Game";

describe("Pexeso", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Pexeso />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("creates and inits squares", () => {
    const game = new Game();
    game.rowLen = 6;
    const squares = game.createSquares();
    expect(squares.length).toEqual(game.rowLen ** 2);
    const numImages = game.rowLen ** 2 / 2;
    expect(numImages).toEqual(18);
  });
});
