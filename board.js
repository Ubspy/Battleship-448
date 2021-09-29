class board{
	/**
	*Creates a ship object containing 9 rows, 10 columns, a 2d array to act as our board, and an array to contain
	*all of our ships that we put on the board
	*The 2D array is initilized to all 0s. When a miss is detected it is a 1, and the ships are added as ship objects.
	*@constructor
	*@return None
	*/
	constructor (){
		this.row=9;
		this.column=10;
		this.board=new Array(this.row).fill().map(() => (new Array(this.column).fill().map(() => 0)));
		this.shipArray=[];
		
	}

	isShip(row, col) {
		return this.shipArray.some((s) => s.squares.some(([r, c]) => r == row && c == col)); // nifty one-liner. This is saying
		// return true if any ship has the property that one of its coordinates [r, c] matches (row, col) given in the
		// function arguments
	}

	/**
	*The function verifies that the position is a legal move and then returns a value depending on
	*what it hit. 
	*@param row An integer describing the row index the player clicked shot at.
	*@param col An integer describing the column index the player clicked shot at.
	*@return a 'M' when the player misses, a 'H' when the player hits a ship, and an 'I' otherwise.
	*/
	attemptedShot(row,col){
		if(this.board[row][col] == 0){//empty spot - valid shot 
			this.board[row][col]=1;//if shot takes place replace zero with 1
			return 'M';
		}
		else if(this.board[row][col] instanceof ship){//if a boat is hit - valid shot 
			let boat = this.board[row][col];
			let [rowHead, colHead] = boat.getHead();
			let distance = Math.abs((rowHead-row)+(col-colHead));
			if(boat.hits[distance] != 1){
				boat.registerHit(distance);
				return 'H';
			}	
		}
		return 'I';//not a valid shot 
	}

	/**
	*The placeShip function is provided a ship, and an index in the array for the tail position
	*The function then uses the newShip's head location to iterate through the board and add
	*an instance of the ship in each of the indices from the head location to the tail location.
	*@param newShip A ship object to be placed onto the board
	*@param rowTail An integer representing the row index of the tail
	*@param colTail An integer representing the column index of the tail
	*@return None
	*/
	placeShip(newShip, rowTail, colTail){
		let [rowHead, colHead] = newShip.getHead()		
		this.shipArray.push(newShip);//adds the ship in the main array 
		
		if(rowHead-rowTail == 0 && colHead-colTail == 0){
			this.board[rowHead][colHead] = newShip;//if its a 1x1 ship
		}
		else if(rowHead-rowTail == 0){// vertical ship 
			if(colHead-colTail < 0){//going down
				for(let i = colHead; i <= colTail; i++){
					this.board[rowHead][i] = newShip;
				}
			}
			else{//going down 
				for(let i = colHead; i >= colTail; i--){
					this.board[rowHead][i] = newShip;
				}
			}
		}
		else if(colHead-colTail == 0){//horizontal ship  
			if(rowHead-rowTail < 0){//going right 
				for(let i = rowHead; i <= rowTail; i++){
					this.board[i][colHead] = newShip;
				}
			}
			else{//going down 
				for(let i = rowHead; i >= rowTail; i--){
					this.board[i][colHead] = newShip;
				}
			}
		}
	}
	/**
	*The getViable tail function takes a rowHead, a colHead, and a size, and computes the tails that may be chosen.
	*
	* @param rowHead The potential row index of the head of the ship
	* @param colHead The potential column index of the head of the ship
	* @param size The potential size of the ship
	* @returns A list of [rowTail, colTail] tuples that the user may pick given the parameters.
	*/
	getViableTail(rowHead, colHead, size){
		let viableTails = [];

		// We will use a helper function that simply tells us if a square is both on the board and not occupied by a ship.
		let isValidSquare = (row, col) => row <= 8 && row >= 0 && col <= 9 && col >= 0 && !this.isShip(row, col);

		
		// We will check up, down, left, then right.

		// Up:
		let viable = true;
		for (let i = 0; i < size; i++) {
			if (!isValidSquare(rowHead-i, colHead)) {
				viable = false;
				break;
			}
		}
		if (viable) {viableTails.push([rowHead-size+1, colHead]);}

		// Down:
		viable = true;
		for (let i = 0; i < size; i++) {
			if (!isValidSquare(rowHead+i, colHead)) {
				viable = false;
				break;
			}
		}
		if (viable) {viableTails.push([rowHead+size-1, colHead]);}

		// Left:
		viable = true;
		for (let i = 0; i < size; i++) {
			if (!isValidSquare(rowHead, colHead-i)) {
				viable = false;
				break;
			}
		}
		if (viable) {viableTails.push([rowHead, colHead-size+1]);}

		// Right:
		viable = true;
		for (let i = 0; i < size; i++) {
			if (!isValidSquare(rowHead, colHead+i)) {
				viable = false;
				break;
			}
		}
		if (viable) {viableTails.push([rowHead, colHead+size-1]);}

		return viableTails;
	}
	/**
	*allSunk() iterates through the shipArray, calling the ship function isSunk() on each ship, then checking if all of the ships have been sunk.
	*@param None
	*@return A boolean, true if all of the ships in shipArray have been sunk, false otherwise.
	*/
	allSunk()
	{
		let count = 0;
		for(let i = 0; i < this.shipArray.length; i++){
			count = count + this.shipArray[i].isSunk();
		}
		if(count == this.shipArray.length){
			return true;
		}
		return false;
	}
	
}
