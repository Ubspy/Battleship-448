class AI {

    /**
     * We're going to have a pseudo enum here, since JS doesn't have enums I'm defining it in the comments here
     * NONE = 0
     * EASY = 1
     * MEDIUM = 2
     * HARD = 3
    **/

    /**
     * This will create an AI object that can handle the firing on a board and the placement of sships
     * @constructor
     * @param aiMode String A string containing the mode of the AI
    **/
    constructor(aiMode) {
       this.mode = aiMode;

        // Initlalize last found and direction vars
        this.lastFound = [];
        this.lastDir = [];

        // We also want a variable for the last ship we fired on
        this.lastFiredOn = [];

        // We need to track the adjacent squares we've fired on
        this.triedAdjacent = [];

        // We need a variable to keep track of backtracking for the medium AI
        this.backTrackLevel = 0;
        this.backTracked = true;

        // This will keep track of what squares we have hit
        this.hits = [];

        // This will keep track of ships that have been hit but not sunk after sinking a ship
        this.extraHits = [];
    }

    isActive()
    {
        return this.mode != 0;
    }

    fire(boardObj) {
        if(this.mode == 1) {
            return this.#easyFire(boardObj);
        }
        else if(this.mode == 2) {
            return this.#mediumFire(boardObj);
        }
        else if (this.mode == 3) {
            return this.#hardFire(boardObj);
        }
    }

    /**
     * The private function to handle firing for the easy mode AI
     * @param boardObj Board The board object that the AI owns in the game, will change the contents of the array to fire
     * @returns What the shot resulted in. 'H' if hit, 'M' if miss.
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
     * @returns What the shot resulted in. 'H' if hit, 'M' if miss.
    **/
    #mediumFire(boardObj) {
        // The very first thing we want to check if the ship we were firing at has sunk
        // To do this, we want to make sure that first we have a shot to check
        if(this.lastFiredOn.length > 0)
        {
            // Then we see if we last fired at a ship, and if that ship was sunk
            if(boardObj.board[this.lastFiredOn[0]][this.lastFiredOn[1]] instanceof ship && boardObj.board[this.lastFiredOn[0]][this.lastFiredOn[1]].isSunk()) {
                // In this case, if the ship is sunk, then we want to reset everything we have so the AI can keep looking for new ships to fire 
                this.lastFound = [];
                this.lastDir = [];
                this.triedAdjacent = [];

                // Now that we've sunk the ship, we want to see if we've hit any squares that aren't a part of sinked ships
                // We don't need to check for instanceof ship here since we can only hit ships
                this.extraHits = this.hits.filter(coord =>
                    !boardObj.board[coord[0]][coord[1]].isSunk());

                // At the end we want to reset the back track level
                this.backTrackLevel = 0;
            }
        }        

        // Define fire result variable to return
        let fireRes = "";

        // At this point, we want to see if we have extra ships we need to sink
        // We also want to do this if we've tried every direction and still haven't sunk a ship
        if((this.lastFound.length == 0 && this.extraHits.length > 0) || this.triedAdjacent.length == 4) {
            // If we do, then we want to update the lastFound variable
            this.lastFound = this.extraHits[0];

            // Then we remove the first element from the extraHits var
            this.extraHits.shift();
        }

        // From here there are three cases, the first case is that we don't currently have a ship that we're firing at
        if(this.lastFound.length == 0) {
            // If this is the case, we fire randomly
            fireRes = this.#fireRandomly(boardObj);

            // Now we want to see if we hit something
            if(fireRes == 'H') {
                // If we did hit something, we set the lastFound member var to this position
                this.lastFound = this.lastFiredOn;
            }
            else if(fireRes == 'I')
            {
                // If we encounter an invalid shot we gotta go shoot again
                return this.#mediumFire(boardObj);
            }
        }
        // The next case is that we have a found ship, but we don't know what direction it's in
        else if(this.lastDir.length == 0) {
            // If this is the case, we want to fire at the random adjacent squares to the ship we found
            fireRes = this.#fireRandomlyAdjacent(boardObj);
        }
        // This is the last case, where we have both a ship we're firing at, and we think we know the direction
        else {
            // In this case, we first want to check if we need to back track
            // This will happen if we continue along our found direction and encounter a miss before the ship is sunk
            if(this.backTrackLevel > 0 && !this.backTracked) {
                // The first thing we need to do is change the lastFiredOn position to the lastFound position,
                // This allows us to basically restart from the original point we hit the at
                this.lastFiredOn = this.lastFound;
                this.backTracked = true;
                
                // Depending on how many times we've already backtracked, we want to behave differently
                if(this.backTrackLevel == 1) {
                    // If this is our first back track, it's most likely that we have the right orientation
                    // We just need to go back the other direction to finish sinking the ship
                    // This just multiplies each element in direction by (-1), reversing the direction
                    this.lastDir = this.lastDir.map(x => x * (-1));
                }
                // The second case means we reversed directions and still encountered a miss, this means we hit some other ship
                else {
                    // If this happens, we want to continue to fire randomly from the original ship position we found
                    // There's some direction we missed that we need to find
                    fireRes = this.#fireRandomlyAdjacent(boardObj);

                    // TODO: Clean this up. repeated code
                    if(fireRes == 'H') {
                        this.hits.push(this.lastFiredOn);
                    }

                    return fireRes;
                }
            }

            // Once we've covered backtracking, we want to get new the location from the last fired on spot, and adding the known direction to it
            let newLoc = this.lastFiredOn.map((coord, i) => coord + this.lastDir[i]);

            // If any of the coordinates for the new location are negative, we abandon ship (pun intended), and back track 
            if(!newLoc.every(coord => coord >= 0))
            {
                // Set back track level and tell the AI we need to backtrack 
                this.backTrackLevel++;
                this.backTracked = false;

                // Fire again now that we've corrected the OOB mistake
                return this.#mediumFire(boardObj);
            }

            // Fire on the next spot we think a ship it at 
            fireRes = boardObj.attemptedShot(newLoc[0], newLoc[1]);

            // If it's a miss, then we need to go back in the other direction
            if(fireRes == 'M') {
                // Set back track level and tell the AI we need to backtrack 
                this.backTrackLevel++;
                this.backTracked = false;
            } 
            else if(fireRes == 'I') {
                // If this spot was already fired on, we need to increment back track level and try to fire again
                this.backTrackLevel++;
                this.backTracked = false;

                return this.#mediumFire(boardObj);
            }

            // Update board location
            this.lastFiredOn = newLoc;
        }

        // For later, we want to store the locations we hit, so if it's hit we want to store it
        if(fireRes == 'H') {
            this.hits.push(this.lastFiredOn);
        }

        // Finally at the end, we want to return the fire result of the spot we tried to fire on
        return fireRes;
    }

    /**
     * Private member function to handle firing for the hard AI implementation.
     * 
     * Hits a ship every shot. Cheats.
     * @param boardObj The board to fire at
     * @returns What the shot resulted in ('H', since this mode always lands a hit).
     */
    #hardFire(boardObj) {
        // Find the first ship square that hasn't been shot at, and shoot at it
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 10; j++) {
                if (boardObj.getSquare(i, j) == 'S') {
                    let fireRes = boardObj.attemptedShot(i, j);
                    this.lastFiredOn = [i, j];
                    return fireRes;
                }
            }
        }
    }

    /**
     * Private member function to randomly fire on a board
     * @param boardObj Board The board object to randomly fire on
     * @returns What the shot resulted in. 'H' if hit, 'M' if miss, and 'I' if the square was previously shot at
    **/
    #fireRandomly(boardObj) {
        // Make random row and col, the board is 9 tall and 10 wide
        let randRow = Math.floor(Math.random() * 9);
        let randCol = Math.floor(Math.random() * 10);
 
        this.lastFiredOn = [randRow, randCol];

        return boardObj.attemptedShot(randRow, randCol);
    }

    /**
     * This will fire randomly at the board given based off of the first position it found a ship at
     * @param boardObj board The board object containing the board we're firing at
     * @returns What the shot resulted in. 'H' if hit, 'M' if miss.
    **/
    #fireRandomlyAdjacent(boardObj) {
        // Here we need to still be firing randomly, so we need to pick a direction to fire in
        let randDirX = Math.floor(Math.random() * 3) - 1; // This will generate a far from -1 to 1
        let randDirY = (randDirX != 0) ? 0 : Math.floor(Math.random() * 3 - 1); // If the x direction isn't 0, then choose a random Y, otherwise no Y direction

        let randDir = [randDirY, randDirX];

        // There's a chance this will generate a random direction of [0, 0]. this is bad because it means we'll be firing at the same spot
        // If that happens then we just try to fire randomly again
        if(randDir[0] == 0 && randDir[1] == 0) {
            return this.#fireRandomlyAdjacent(boardObj);
        }

        // Create a new location from the last found ship and the random direction
        let newLoc = this.lastFound.map((coord, i) => coord + randDir[i]);

        // Check for OOB shot
        if(!newLoc.every(coord => coord >= 0))
        {
            // If OOB, try firing again, because this direction isn't any good
            return this.#fireRandomlyAdjacent(boardObj);
        }

        // We want to see if this is a repeat location
        // The way I stored locations makes indexOf not work, so I need to check for it like this, which is gross but not as gross as main.js
        if(this.triedAdjacent.findIndex(coord => coord[0] == newLoc[0] && coord[1] == newLoc[1]) >= 0) {
            // If it is, then we just try to fire again, and break out of this function call afterwards
            return this.#fireRandomlyAdjacent(boardObj);
        }

        // Once we have a valid direction, we want to attempt a shot at that location
        let fireRes = boardObj.attemptedShot(newLoc[0], newLoc[1]);

        // Checks if we hit a ship
        if(fireRes == 'H') {
            // If we hit, we need to set our direction so the AI knows to keep firing this way
            this.lastDir = [randDirY, randDirX];

            // We also want to clear the attempted adjacent arr since we now have a direction
            this.triedAdjacent = [];
        }
        else if(fireRes == 'I') {
            // Add this to tried adjacent var
            this.triedAdjacent.push(newLoc);

            // If we're already fired there then we try again
            return this.#fireRandomlyAdjacent(boardObj);
        }
        else {
            // Here we've missed, so we want to update the triedAdjacent var so we don't fire on it again
            this.triedAdjacent.push(newLoc);
        }

        // We want to update the last fired on var
        this.lastFiredOn = newLoc;

        // Return fire result
        return fireRes;
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
        // If the AI isn't active, play no ships
        if(this.mode == 0) {
            return;
        }

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
