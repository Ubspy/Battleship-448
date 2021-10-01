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

        // Initlalize last found and direction vars
        this.lastFound = [];
        this.lastDir = [];

        // We also want a variable for the last ship we fired on
        this.lastFiredOn = [];

        // We need to track the adjacent squares we've fired on
        this.triedAdjacent = [];
    }

    fire(boardObj) {
        if(this.mode == 0) {
            return this.#easyFire(boardObj);
        }
        else if(this.mode == 1) {
            return this.#mediumFire(boardObj);
        }
        else if (this.mode == 1) {
            this.#mediumFire(boardMatrix);
        }
        else if (this.mode == 2) {
            this.#hardFire(boardMatrix);
        }
    }

    /**
     * The private function to handle firing for the easy mode AI
     * @param boardObj Board The board object that the AI owns in the game, will change the contents of the array to fire
    **/
    #easyFire(boardObj) {
        let fireRes = "";

        do {
            // Fire randomly and store the result
            fireRes = this.#fireRandomly(boardObj);
        } while(fireRes == 'I');
        
        return fireRes;
    }

    /**
     * Private member function to handle firing for the medium AI implementation
     * @param boardObj Board The board object that the AI should fire on
    **/
    #mediumFire(boardObj) {
        // First thing we want to do here is make sure we don't have a ship we're currently trying to sink
        if(this.lastFound == "") {
            // If this is the case, we fire randomly
            let fireRes = this.#fireRandomly(boardObj);

            // Now we want to see if we hit something
            if(fireRes == 'H') {
                this.lastFound = this.lastFiredOn;
                console.log(`Found first ship at (${this.lastFiredOn[1]}, ${this.lastFiredOn[0]})`);
            }

            return fireRes;
        }
        // If we get here then we know there's a ship we need to keep firing at it
        // We want to check the last concrete direction, because that's how we'll know if we need to stop firing randomly
        else if(this.lastDir == "")
        {
            // Here we need to still be firing randomly, so we need to pick a direction to fire in
            let randDirX = Math.floor(Math.random() * 2) - 1; // This will generate a far from -1 to 1
            let randDirY = (randDirX != 0) ? 0 : Math.floor(Math.random() * 2 - 1); // If the x direction isn't 0, then choose a random Y, otherwise no Y direction

            let randDir = [randDirY, randDirX];

            console.log(this.lastFound);

            // Create a new location from the last found ship and the random direction
            let newLoc = this.lastFound.map((coord, i) => coord + randDir[i]);

            // First we want to see if this is a repeat location
            if(this.triedAdjacent.indexOf(newLoc) >= 0) {
                // If it is, then we just try to fire again, and break out of this function call afterwards
                return this.#mediumFire(boardObj);
            }

            let fireRes = boardObj.attemptedShot(newLoc[0], newLoc[1]);

            if(fireRes == 'H') {
                // If we hit, we need to set our direction
                this.lastDir = [randDirY, randDirX];

                // We also want to clear the attempted adjacent arr
                this.triedAdjacent = [];

                console.log(`Hit next at: (${newLoc[1]}, ${newLoc[0]})`);
                console.log(`Has direction: (${randDirX}, ${randDirY})`);
            }
            else {
                // Here we've missed, so we want to update the triedAdjacent var
                this.triedAdjacent.push(newLoc);
            }

            // We want to update the last fired on var
            this.lastFiredOn = newLoc;

            // Return fire result
            return fireRes;
        }
    }

    /**
     * Private member function to handle firing for the hard AI implementation.
     * 
     * Hits a ship every shot. Cheats.
     * @param {*} boardObj The board to fire at
     */
    #hardFire(boardObj) {
        // Find the first ship square that hasn't been shot at, and shoot at it
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 10; j++) {
                if (boardObj.getSquare(i, j) == 'S') {
                    boardObj.attemptedShot(i, j);
                }
            }
        }
    }

    /**
     * Private member function to randomly fire on a board
     * @param boardObj Board The board object to randomly fire on
    **/
    #fireRandomly(boardObj) {
        // Make random row and col, the board is 9 tall and 10 wide
        let randRow = Math.floor(Math.random() * 9);
        let randCol = Math.floor(Math.random() * 10);

        this.lastFiredOn = [randRow, randCol];

        return boardObj.attemptedShot(randRow, randCol);
    }

    /**
     * Places ships randomly on the board.
     * 
     * Places the specified number of ships on the specified board. Places ships of increasing length.
     * For example, placeShips(board, 3) will first place a ship of size 1, then a ship of size 2, then
     * a ship of size 3.
     * 
     * @param {*} boardObj The board object to place ships on
     * @param {*} numberOfShips The number of ships to place
     */
    placeShips(boardObj, numberOfShips) {
        for (let i = 1; i <= numberOfShips; i++) { // for the number of ships we want to place
            while(true) {
                let proposedShip = randomShip(i); // propose a placement for a ship of size i
                // check if every coordinate of the proposed ship is free space
                if (proposedShip.every(([r, c]) => !(boardObj.board[r][c] instanceof ship))) {
                    // place the ship if so
                    boardObj.placeShip(new ship(i, 2, proposedShip[0][0], proposedShip[0][1]), proposedShip[i-1][0], proposedShip[i-1][1]);
                    break;
                }
                // otherwise, keep proposing random ships
            }
        }
    }

    getLastFire() {
        return this.lastFiredOn;
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
        maxRowHead = 8; // index 8 == row 9
        maxColHead = 10 - length; // e.g. length == 1 => maxColHead == 9, corresponding to 10th column
    } else {
        maxRowHead = 9 - length;
        maxColHead = 9;
    }

    let rowHead = Math.floor(Math.random() * (maxRowHead + 1)); // 0..8
    let colHead = Math.floor(Math.random() * (maxColHead + 1)); // 0..9

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
