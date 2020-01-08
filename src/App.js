import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  TILES
} from "./constants";

const App = () => {
  const canvasRef = useRef();
  const [wrap, setWrap] = useState(false);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [nextDir, setNextDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [tiles, setTiles] = useState(TILES);
  const [score, setScore] = useState(0);

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setScore(snake.length);
    setGameOver(true);
  };

  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setNextDir(JSON.stringify(dir.map(x=>x*-1)) === JSON.stringify(DIRECTIONS[keyCode])?dir:DIRECTIONS[keyCode]);

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * tiles[i]));//(CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      !wrap &&
      (piece[0] >= tiles[0] ||
      piece[0] < 0 ||
      piece[1] >= tiles[1] ||
      piece[1] < 0)
    )
      return true;
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    setDir(nextDir);
    console.log(snake);
    //JSON.parse(JSON.stringify(snake))f
    const snakeCopy = snake.map(x  => {console.log(x); return x});
    console.log(snakeCopy);
    
    console.log(snake);
    //const newSnakeHeadXPos = (((snakeCopy[0][0] + dir[0]) % tiles[0])+tiles[0])%tiles[0];
    const newSnakeHeadXPos = wrap?((((snakeCopy[0][0] + dir[0]) % tiles[0])+tiles[0])%tiles[0]):(snakeCopy[0][0] + dir[0]);
    const newSnakeHeadYPos = wrap?((((snakeCopy[0][1] + dir[1]) % tiles[1])+tiles[1])%tiles[1]):(snakeCopy[0][1] + dir[1]);
    const newSnakeHead = [newSnakeHeadXPos,newSnakeHeadYPos];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = (speed,width,height,wrap) => {
    console.log("LALLA");
    setApple(APPLE_START);
    setDir([0, -1]);
    setNextDir([0,-1]);
    setSpeed(speed||speed||SPEED);
    setGameOver(false);
    setTiles([Number(width),Number(height)]);
    setSnake(SNAKE_START);
    setScore(0);
    setWrap(wrap);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "pink";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "lightblue";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      <div style={{display:'inline-block'}}>
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${tiles[0]*SCALE}px`}
        height={`${tiles[1]*SCALE}px`}
      />
      </div>
      {/* <br/> */}
      <div style={{/*display:'inline-block'*/float:'right', width:'auto',border:'1px solid black',position: 'relative'}}  >
        <div /*style={{display:'inline-block',margin:'auto'}}*/>
        {gameOver && <div>GAME OVER! Score: {score}</div>}
        <button onClick={() => startGame(document.getElementById('speed').value,document.getElementById('mapWidth').value,document.getElementById('mapHeight').value,document.getElementById('wrapMode').checked)}>Start Game</button>
        <br/>
        <p>Frame rate:</p>
        <input id="speed" name="speed" type="number" defaultValue={speed||SPEED} />
        <br/>
        <p>Map width:</p>
        <input id="mapWidth" type="number" defaultValue={tiles[0]||TILES[0]} />
        <br/>
        <p>Map height:</p>
        <input id="mapHeight" type="number" defaultValue={tiles[1]||TILES[1]} />
        <p>Wrap map:</p>
        <input id="wrapMode" type="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default App;
