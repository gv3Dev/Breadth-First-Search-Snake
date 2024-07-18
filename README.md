# Breadth-First-Search-Snake 🐍🍎
<br/><img src="https://github.com/gv3Dev/Breadth-First-Search-Snake/blob/main/snakeAlgo.png?raw=true"/><br/>
#### Please note that this script is not finished & requires more work. However, it is usable & fully functional, it just isn't at it's best. (yet) :) <br/>

This repository contains a JavaScript implementation of a Breadth-First Search (BFS) based pathfinding algorithm for the classic Snake game. The script automatically plays the game, guiding the snake towards the food while avoiding collisions with its own body and the walls.

## Features

- **Breadth-First Search (BFS) Pathfinding**: Utilizes BFS to find the shortest path from the snake's head to the food.
- **Collision Avoidance**: Ensures the snake avoids running into its own body or the walls.
- **Blockade Prevention**: Prevents the snake from forming a blockade that spans the full length of the canvas, either vertically or horizontally.

## How It Works

The script continuously executes the following steps at regular intervals:

1. **Locate Food**: Retrieves the position of the food on the grid.
2. **Locate Snake**: Retrieves the position of the snake's head and body on the grid.
3. **Pathfinding**: Uses BFS to find the shortest path to the food, considering only safe moves that do not result in collisions or blockades.
4. **Move Execution**: Simulates keypresses to move the snake towards the food along the computed path.

## Code Overview

### `main`

The main function initializes the game area, calculates the grid size, and sets up the canvas for debugging purposes. It also calls `foodMapping` and `moveTowardsFood` functions to start the pathfinding and movement logic.

### `foodMapping`

Continuously tracks the position of the food and updates the grid colors for visualization.

### `moveTowardsFood`

The core function that runs at regular intervals to compute the next move towards the food using BFS pathfinding. It handles collisions and ensures the snake doesn't form a blockade.

### Helper Functions

- **`handleEmulateKeyPress`**: Simulates keypress events to move the snake.
- **`getHeadAttributes`**: Retrieves the current position and size of the snake's head.
- **`positionToGrid`**: Converts pixel positions to grid coordinates.
- **`isCollision`**: Checks if a move would result in a collision with the snake's body.
- **`isWallCollision`**: Checks if a move would result in a collision with the wall.
- **`isSafeToMove`**: Ensures a move is safe by combining the above checks.
- **`wouldFormFullLine`**: Prevents the snake from forming a blockade.
- **`getNeighbors`**: Retrieves neighboring cells for BFS.
- **`bfsPathfinding`**: Implements BFS to find the shortest path to the food.

## Usage

To use this script with Tampermonkey:

1. **Install Tampermonkey**: Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. **Create a New Script**: Open Tampermonkey, create a new script, and paste the script code into it.
3. **Save and Enable**: Save the script and ensure it is enabled.
4. **Play the Game**: Open [patorjk.com/games/snake](https://patorjk.com/games/snake/) and watch the script play the game automatically.
