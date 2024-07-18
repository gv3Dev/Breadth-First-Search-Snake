// ==UserScript==
// @name         Breadth First Search Snake Algo
// @namespace    http://tampermonkey.net/
// @version      2024-07-18
// @description  Will play snake on its own, cute right? -_-
// @author       GV3Dev
// @match        https://patorjk.com/games/snake/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patorjk.com
// @grant        none
// ==/UserScript==

const handleEmulateKeyPress = (key) => {
    const gameArea = document.querySelector("#game-area");
    const keyMappings = { "up": 38, "down": 40, "right": 39, "left": 37, "space": 32 },
          event = new KeyboardEvent('keydown', { 'keyCode': keyMappings[key], 'which': keyMappings[key] });
    gameArea.dispatchEvent(event);
}


const getHeadAttributes = () => {
    const snakeHead = document.querySelector("#snake-snakehead-alive");
    let currStyle = snakeHead.getAttribute("style"),
        { left, top } = { left: parseInt(currStyle.split("left:")[1].split("px;")[0].trim()), top: parseInt(currStyle.split("top:")[1].split("px;")[0].trim()) },
        { width, height } = { width: parseInt(currStyle.split("width:")[1].split("px;")[0].trim()), height: parseInt(currStyle.split("height:")[1].split("px;")[0].trim()) };
    return { position: { left, top }, size: { width, height } };
}

const main = () => {

    const gameArea = document.querySelector("#playingField");
    let boardSize = ((boardStyle = gameArea.getAttribute("style")) => {
        return {
            width: parseInt(boardStyle.split("width:")[1].split("px;")[0].trim()),
            height: parseInt(boardStyle.split("height:")[1].split("px;")[0].trim())
        };
    })();

    const headAttributes = getHeadAttributes();
    const headSize = headAttributes.size;
    const numColumns = Math.floor(boardSize.width / headSize.width);
    const numRows = Math.floor(boardSize.height / headSize.height);
    const canvas = document.createElement('canvas');
    canvas.width = boardSize.width;
    canvas.height = boardSize.height;
    canvas.style.position = 'absolute';
    canvas.style.top = gameArea.offsetTop + 'px';
    canvas.style.left = gameArea.offsetLeft + 'px';
    canvas.style.zIndex = 1;
    gameArea.parentElement.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    const grid = [];
    for (let col = 0; col < numColumns; col++) {
        grid[col] = [];
        for (let row = 0; row < numRows; row++) {
            const x = col * headSize.width;
            const y = row * headSize.height;
            grid[col][row] = { x, y };
            ctx.strokeRect(x, y, headSize.width, headSize.height);
        }
    }
    const resetColors = () => {
        for (let col = 0; col < numColumns; col++) {
            for (let row = 0; row < numRows; row++) {
                const cell = grid[col][row];
                ctx.clearRect(cell.x, cell.y, headSize.width, headSize.height);
                ctx.strokeRect(cell.x, cell.y, headSize.width, headSize.height);
            }
        }
    };
    const changeCellColor = (col, row, color) => {
        if (grid[col] && grid[col][row]) {
            for (let r = 0; r < numRows; r++) {
                const cell = grid[col][r];
                ctx.fillStyle = color;
                ctx.fillRect(cell.x, cell.y, headSize.width, headSize.height);
                ctx.strokeRect(cell.x, cell.y, headSize.width, headSize.height);
            }
            for (let c = 0; c < numColumns; c++) {
                const cell = grid[c][row];
                ctx.fillStyle = color;
                ctx.fillRect(cell.x, cell.y, headSize.width, headSize.height);
                ctx.strokeRect(cell.x, cell.y, headSize.width, headSize.height);
            }
        }
    };

    const positionToGrid = (top, left) => {
        const col = Math.floor(left / headSize.width);
        const row = Math.floor(top / headSize.height);
        return { col: col - 1, row: row - 1 };
    };

    foodMapping(positionToGrid, changeCellColor, resetColors);
    moveTowardsFood(numColumns, numRows, positionToGrid, changeCellColor, resetColors)
};

const foodMapping = (positionToGrid, changeCellColor, resetColors) => {
    let lastPosition = { left: null, top: null };
    setInterval(() => {
        const foodStyle = document.querySelector("#snake-food-0").getAttribute("style");
        let { left, top } = { left: parseInt(foodStyle.split("left:")[1].split("px;")[0].trim()), top: parseInt(foodStyle.split("top:")[1].split("px;")[0].trim()) };
        if (lastPosition.left !== left || lastPosition.top !== top) {
            resetColors();
            let { col, row } = positionToGrid(top, left);
            changeCellColor(col, row, "rgba(255, 0, 0, 0.45)");
            lastPosition = { left, top };
        }
    }, 10);
}

const moveTowardsFood = (numColumns, numRows, positionToGrid, changeCellColor, resetColors) => {
    setInterval(() => {
        const foodStyle = document.querySelector("#snake-food-0").getAttribute("style");
        let foodPosition = { left: parseInt(foodStyle.split("left:")[1].split("px;")[0].trim()), top: parseInt(foodStyle.split("top:")[1].split("px;")[0].trim()) };
        let foodOnGrid = positionToGrid(foodPosition.top, foodPosition.left);
        let snakeHeadPosition = getHeadAttributes().position;
        let snakeHeadOnGrid = positionToGrid(snakeHeadPosition.top, snakeHeadPosition.left);
        let snakeBody = Array.from(document.querySelectorAll(".snake-snakebody-block.snake-snakebody-alive")).filter((elem) => (elem.id !== "snake-snakehead-alive"));
        let avertArray = snakeBody.map((snakeBodyPart) => {
            let bodyPartStyle = snakeBodyPart.getAttribute("style");
            let { left, top } = { left: parseInt(bodyPartStyle.split("left:")[1].split("px;")[0].trim()), top: parseInt(bodyPartStyle.split("top:")[1].split("px;")[0].trim()) };
            let gridPosition = positionToGrid(top, left);
            return gridPosition;
        });

        const isCollision = (col, row) => {
            return avertArray.some(part => part.col === col && part.row === row);
        };

        const isWallCollision = (col, row) => {
            return col < 0 || row < 0 || col >= numColumns || row >= numRows;
        };

        const isSafeToMove = (col, row) => {
            return !isCollision(col, row) && !isWallCollision(col, row);
        };

        const wouldFormFullLine = (col, row, avertArray) => {
            let sameRow = avertArray.filter(part => part.row === row);
            let sameCol = avertArray.filter(part => part.col === col);

            let rowFull = sameRow.length === numColumns - 1;
            let colFull = sameCol.length === numRows - 1;

            return rowFull || colFull;
        };

        const getNeighbors = (col, row) => {
            return [
                { col, row: row - 1, key: "up" },
                { col, row: row + 1, key: "down" },
                { col: col + 1, row, key: "right" },
                { col: col - 1, row, key: "left" }
            ].filter(pos => isSafeToMove(pos.col, pos.row) && !wouldFormFullLine(pos.col, pos.row, avertArray));
        };

        const bfsPathfinding = (start, goal) => {
            let queue = [start];
            let cameFrom = new Map();
            cameFrom.set(`${start.col},${start.row}`, null);

            while (queue.length > 0) {
                let current = queue.shift();
                if (current.col === goal.col && current.row === goal.row) {
                    let path = [];
                    while (current) {
                        path.push(current);
                        current = cameFrom.get(`${current.col},${current.row}`);
                    }
                    return path.reverse();
                }

                for (let neighbor of getNeighbors(current.col, current.row)) {
                    if (!cameFrom.has(`${neighbor.col},${neighbor.row}`)) {
                        queue.push(neighbor);
                        cameFrom.set(`${neighbor.col},${neighbor.row}`, current);
                    }
                }
            }
            return null;
        };

        let path = bfsPathfinding(snakeHeadOnGrid, foodOnGrid);
        if (path && path.length > 1) {
            let nextMove = path[1];
            let direction = nextMove.key;
            handleEmulateKeyPress(direction);
        } else {
            let moveOptions = getNeighbors(snakeHeadOnGrid.col, snakeHeadOnGrid.row);
            if (moveOptions.length > 0) {
                handleEmulateKeyPress(moveOptions[0].key);
            }
        }
    }, 5);
};

main();
