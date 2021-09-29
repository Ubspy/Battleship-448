class AI {

    /**
     * We're going to have a pseudo enum here, since JS doesn't have enums I'm defining it in the comments here
     * EASY = 0
     * MEDIUM = 1
     * HARD = 2
    **/

    /**
     * This will create an AI object that can handle the firing on a board and the placement of sships
     * @constructor
     * @param aiMode String A string containing the mode of the AI
    **/
    constructor(aiMode) {
        if(aiMode == "easy")
        {
            this.mode = 0;
        }
        else if(aiMode == "medium")
        {
            this.mode = 1;
        }
        else if(aiMode == "hard")
        {
            this.mode = 2;
        }

        // TODO: Account for input
    }

    /**
     *
    **/
    fire(boardMatrix) {
        if(this.mode == 0) {
            this.#easyFire(boardMatrix);
        }
    }

    // TODO: I found this method from https://stackoverflow.com/questions/55611/javascript-private-methods
    // I have no idea if this will actually work though, we want to check this
    /**
     * The private function to handle firing for the easy mode AI
     * @param boardObj Board The board object that the AI owns in the game, will change the contents of the array to fire
    **/
    #easyFire(boardObj) {
       let fireRes = "";

        do {
            // Make random row and col, the board is 9 tall and 10 wide
            let randRow = Math.floor(Math.random() * 9);
            let randCol = Math.floor(Math.random() * 10);

            fireRes = boardObj.attemptedShot(randRow, randCol);
        } while(fireRes == 'I');
    }

    placeShips(board, numberOfShips) {
        for (let i = 1; i <= numberOfShips; i++) { // for the number of ships we want to place
            while(true) {
                let proposedShip = randomShip(i); // propose a placement for a ship of size i
                // check if every coordinate of the proposed ship is free space
                if (proposedShip.every(([r, c]) => !(board.board[r][c] instanceof ship))) {
                    // place the ship if so
                    board.placeShip(new ship(i, 2, proposedShip[0][0], proposedShip[0][1]), proposedShip[i-1][0], proposedShip[i-1][1]);
                    break;
                }
                // otherwise, keep proposing random ships
            }
        }
    }
}

/**
 * Generates random coordinates for a ship, given the length.
 * 
 * This function guarantees that the ship will fit within the dimensions of the board.
 * However, it is up to the caller to check that the returned ship coordinates do not
 * overlap with another ship already on the board.
 * 
 * @param length The length of the ship
 * @returns A list of [row, col] coordinates that the ship occupies.
 */
function randomShip(length) {

    // To simplify things, we are only going to place the tail to the right of or below the head.
    // First, we need to pick an orientation, that way we know whether we need to leave extra 
    // room horizontally or vertically.

    let isHorizontal = Math.round(Math.random()); // 0 or 1

    let maxRowHead = 0;
    let maxColHead = 0;

    let shipSquares = [];

    if (isHorizontal) {
        maxRowHead = 9; // index 9 == row 10
        maxColHead = 11 - length; // e.g. length == 1 => maxColHead == 10, corresponding to 11th column
    } else {
        maxRowHead = 10 - length;
        maxColHead = 10;
    }

    let rowHead = Math.floor(Math.random() * (maxRowHead + 1)); // 0..9
    let colHead = Math.floor(Math.random() * (maxColHead + 1)); // 0..10

    if (isHorizontal) {
        for (let i = 0; i < length; i++) {
            shipSquares.push([rowHead, colHead+i]);
        }
    } else {
        for (let i = 0; i < length; i++) {
            shipSquares.push([rowHead+i, colHead]);
        }
    }

    return shipSquares;
}
