const SNAKE_START = [
  [8, 7],
  [8, 8]
];
const APPLE_START = [8, 3];
const SCALE = 40;
const TILES = [20,20];
const SPEED = 200;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0] // right
};

export {
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  TILES
};
