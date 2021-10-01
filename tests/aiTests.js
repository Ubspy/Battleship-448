// TODO: Assumes an AI class
// This just prints the status of all the AI tests that were written
function testEasyAI() {
    console.log("Easy AI tests:");
    console.log(`Full test: ${this.easyFullTest() ? "PASSED" : "FAILED"}`);

    let randomAIPlaceScore = this.easyRandomTest(); 
    console.log(`Random test: ${randomAIPlaceScore > 0 ? "PASSED" : "FAILED"} with random score of ${randomAIPlaceScore}`);
}

// This test has multiple parts, first we fire until hit something. From there, the AI should know that the next spot is adjacent to that location
// From there, the AI should sink the ship in S - 2 + 1 turns, with S being the size of the ship. We subtract two because we've already hit two spots
// on the ship, and we add one because there's a chance that you hit the middle of the ship, so the AI will go until it misses, the go the opposite
// direction from the original hit point
function testMediumAI() {
    let aiBoard = new board(6);
    
    // TODO: This needs to be implemented
    let mediumAI = new AI("medium");

    // TODO: This needs to be implemented
    let ships = mediumAI.placeShips(aiBoard);

    let currentHit = null;

    // We want to fire until we hit a square
    do
    {
        // TODO: This needs to be implemented
        currentHit = mediumAI.fire(aiBoard);  
    } while(currentHit != 'H');

    // TODO: This needs to be implemented
    let lastFiredSpot = mediumAI.getLastFire();
    let firedShip = aiBoard[lastFiredSpot[0]][lastFiredSpot[1]];

    // At this point, we want to make sure this ship size is larger than two, so we'll check for that
    if(firedShip.getSize() <= 2)
    {
        // Then we'll just run the test again, so we'll recurse
        return this.testMediumAI();
    }

    for(let i = 0; i < 4; i++)
    {
        // Fire again
        // TODO: This needs to be implemented
        currentHit = mediumAI.fire(aiBoard);

        // If we hit, break from the loop
        if(currentHit == 'H')
        {
            break;
        }
    }

    // If we get through the for loop and we did not hit anything, the test failed
    if(currentHit == 'M')
    {
        return false;
    }

    // If it makes it all the way then our AI did it right, and we should be able to then keep going for the size of the ship to sink it
    // We will fire two less than the ship size since we already fired on two of the squared
    // We fire once more though incase it reached the end of the ship and needs to go back
    for(var i = 0; i < firedShip.getSize() - 1; i++)
    {
        // TODO: This needs to be implemented
        mediumAI.fire(aiBoard);
    }

    // At this point the ship should be sunk, if it's not then the AI doesn't work properly
    return firedShip.isSunk(); 
}

// This test isn't super necessary, but it's better than not having it I suppose.
// This test randomly fires at the board using the easy mode 90 times (as many squares as the board)
// it then checks if the board is full
function easyFullTest() {
    // For an easy AI, first we need to establish a game
    // Make a new board for the player and the AI 
    aiBoard = new board();

    // TODO: This function needs to be added
    // Makes a new AI object
    easyAI = new AI("easy");

    // TODO: This function needs to be added
    easyAI.placeShips(aiBoard, 6);

    // The first test I have is that we call the AI fire function for as many squares as there are on the board
    // We don't care about the players turn in this case, so we won't bother with their turns
    // If all the squares are full, then we at least know it's doing that right
    for(let i = 0; i < 90; i++) {
        // TODO: This needs to be implemented
        easyAI.fire(aiBoard);
    }

    // Bool for full result
    let full = true;

    // Now loop through and see if they're all hit
    for(let y = 0; y < 9; y++) {
        for(let x = 0; x < 10; x++) {
            if(aiBoard.board[y][x] instanceof ship) {
                let boat = aiBoard.board[y][x];

                // TODO: This function needs to be added
                // AND full with itself so once it's false it can't be true again
                full = full && boat.getHit(y, x);
            }
            else {
                // 1 means hit square, so check for that if it's not a ship
                full = full && aiBoard.board[y][x] == 1;
            }
        }
    }

    return full;
}

// This tests creates two easy AI objects and fires at their own board 30 times each
// We then compare the boards to see how random the firing is
function easyRandomTest() {
    // TODO: This needs to be implemented
    let easyAI = new AI("easy");
    
    let aiOneBoard = new board(6);
    let aiTwoBoard = new board(6);

    for(let i = 0; i < 30; i++) {
        // TODO: This needs to be implemented
        easyAI.fire(aiOneBoard); // TODO: Implement this function
        easyAI.fire(aiTwoBoard); // TODO: Implement this function
    }

    // Get a score of how random is from 0 to 1 based on how many of the squares of the 30 turns are different
    // 1 means no randomness, and one means it's too random, the closer to one the better
    return randomBoardTest(aiOneBoard, aiTwoBoard) / 30 - 1;
}

function validPlacementTest(aiObject) {
    // Given an AI object, creates 10 boards with a capacity of 6 ships.
    // Has the AI place ships on the board, then checks that there aren't any invalid placements (i.e., overlapping ships,
    // outside of the board). Checks this simply by asserting that there are 6+5+4+3+2+1 = 21 ship squares on the board.
    for (var i = 0; i < 10; i++) {
        let board = new board();
        aiObject.placeShips(board, 6);

        let shipSquares = board.board.reduce((prevSum, currArr) => prevSum + currArr.reduce((prevSum2, currSquare) => {
            if (currSquare instanceof ship) {
                return prevSum2 + 1;
            } else {
                return prevSum2;
            }
        }));
        if (shipSquares != 21) {
            return false;
        }
    }
    return true;
}

function randomPlacementTest(difficulty) {
    // Given the difficulty string, creates two AI objects of the same difficulty. Creates two boards of 6 ships.
    // Has each AI place the ships on its own board. Finally, uses randomBoardTest() to assert that the ships
    // have not been placed in the same spots by the two AI objects.

    let aiOne = new AI(difficulty);
    let aiTwo = new AI(difficulty);

    let boardOne = new board(6);
    let boardTwo = new board(6);

    aiOne.placeShips(boardOne, 6);
    aiTwo.placeShips(boardTwo, 6);
    
    return randomBoardTest(boardOne, boardTwo); // not sure what arithmetic to do from here but this is a start.
}

function testHardAI() {
    // Creates a hard AI object and a board. Places 6 ships on the board.
    // Has the AI fire 6+5+4+3+2+1 = 21 times. Since it cheats, it should have hit every time and not missed a single shot.
    let ai = new AI("hard");

    let brd = new board();
    ai.placeShips(brd, 6);
    for (let i = 0; i < 21; i++) {
        ai.fire();
    }
    return brd.allSunk();
}

// Helper function to determine how different two distinct boards are
function randomBoardTest(boardOne, boardTwo) {
    let randScore = 0;

    for(var y = 0; y < 9; y++) {
        for(var x = 0; x < 10; x++) {
            if(boardOne.board[y][x] != boardTwo.board[y][x]) {
                randScore++;
            }
        }
    }

    return randScore;
}
