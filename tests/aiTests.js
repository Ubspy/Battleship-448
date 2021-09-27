class AITests
{
    // TODO: Assumes an AI class
    // This just prints the status of all the AI tests that were written
    testEasyAI() {
        console.log("Easy AI tests:");
        console.log(`Full test: ${}`, (this.easyFullTest() ? "PASSED" : "FAILED"));

        let randomAIPlaceScore = this.easyRandomTest(); 
        console.log(`Random test: ${} with random score of ${}`, (randomAIPlaceScore > 0 ? "PASSED" : "FAILED"), randomAIPlaceScore);

        console.log(`\nMedium AI sunk ship test: ${}`, (this.testMediumAI() ? "PASSED" : "FAILED"));
    }

    // This test has multiple parts, first we fire until hit something. From there, the AI should know that the next spot is adjacent to that location
    // From there, the AI should sink the ship in S - 2 + 1 turns, with S being the size of the ship. We subtract two because we've already hit two spots
    // on the ship, and we add one because there's a chance that you hit the middle of the ship, so the AI will go until it misses, the go the opposite
    // direction from the original hit point
    testMediumAI() {
        let aiBoard = new board(6);
        
        // TODO: This needs to be implemented
        let mediumAI = new AI("medium");

        // TODO: This needs to be implemented
        let ships = mediumAI.placeShips();
 
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
    easyFullTest() {
        // For an easy AI, first we need to establish a game
        // Make a new board for the player and the AI 
        aiBoard = new board(6);

        // // TODO: This function needs to be added
        // Makes a new AI object
        easyAI = new AI("easy");

        // TODO: This function needs to be added
        easyAI.placeShips();

        // The first test I have is that we call the AI fire function for as many squares as there are on the board
        // We don't care about the players turn in this case, so we won't bother with their turns
        // If all the squares are full, then we at least know it's doing that right
        for(let i = 0; i < 90; i++) {
            // TODO: This needs to be implemented
            easyAI.fire(aiBboard);
        }

        // Bool for full result
        let full = true;

        // Now loop through and see if they're all hit
        for(let y = 0; y < 9; y++) {
            for(let x = 0; i < 10; x++) {
                if(aiBoard[y][x] instanceof ship) {
                    let boat = aiBoard[y][x];

                    // TODO: This function needs to be added
                    // AND full with itself so once it's false it can't be true again
                    full = full && boat.getHit(y, x);
                }
                else {
                    // 0 means empty square, so check for that if it's not a ship
                    full = full && aiBoard[y][x] == 0;
                }
            }
        }

        return full;
    }

    // This tests creates two easy AI objects and fires at their own board 30 times each
    // We then compare the boards to see how random the firing is
    easyRandomTest() {
        // TODO: This needs to be implemented
        let easyAi = new AI("easy");
        let aiOneBoard = new board(6);
        let aiTwoBoard = new board(6);

        for(let i = 0; i < 30; i++) {
            // TODO: This needs to be implemented
            easyAI.fire(aiOneBoard); // TODO: Implement this function
            easyAI.fire(aiTwoBoard); // TODO: Implement this function
        }

        // Get a score of how random is from 0 to 2 based on how many of the squares of the 30 turns are different
        // 0 means no randomness, and two means it's too random, the closer to one the better, but anywhere from 1 to 2 is acceptable
        return randomBoardTest(aiOneBoard, aiTwoBoard) / 30;
    }

    // Helper function to determine how different two distinct boards are
    randomBoardTest(boardOne, boardTwo) {
        randomScore = 0;

        for(var y = 0; y < 9; y++) {
            for(var x = 0; x < 10; x++) {
                if(boardOne[y][x] != boardTwo[y][x]) {
                    randScore++;
                }
            }
        }

        return randomScore;
    }
}
