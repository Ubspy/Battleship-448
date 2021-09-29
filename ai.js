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
}
