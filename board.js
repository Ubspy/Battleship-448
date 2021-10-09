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
		else if(this.board[row][col] instanceof trap){//if a boat is hit - valid shot 
			console.log("trap hit")
			return "T"
		}
		return 'I';//not a valid shot 
	}

	/**
	 * Gets the type of square indexed by (row, col). Returns 'H' for hit, 'M' for miss, 'S' for ship, and 'W' for just water.
	 * @param {*} row The index of the row to check (0-8)
	 * @param {*} col The index of the column to check (0-9)
	 * @returns 'H' if the square is hit, 'M' if it's a missed shot, 'S' for a ship that hasn't been hit, and 'W' for just water.
	 */
	getSquare(row, col) {
		if (this.board[row][col] instanceof ship) {
			let boat = this.board[row][col];
			let [rowHead, colHead] = boat.getHead();
			let distance = Math.abs((rowHead-row)+(col-colHead));
			if(boat.hits[distance] == 1){
				return 'H';
			}
			else {
				return 'S';
			}
		}
		else if (this.board[row][col] == 0) {
			return 'W';
		}
		else if (this.board[row][col] == 1) {
			return 'M';
		}
	}

	// TODO: Document this
	multiShot(row, col, boardNum){
		var outCome; 
		for(var i=0; i<=8; i+=2)
		{
			outCome = this.attemptedShot(row, col+i);
			if(outCome == 'T')
			{
				console.log("Hit a trap");
			}
			if(outCome == 'H')
			{
				if(currentTurn == 1)
				{
					$('.gridRight .cell[ row = ' + row + '][ col = ' + (col+i) + ']').css("background-color", "rgb(255, 0, 0)");
					$('.gridRight .cell[ row = ' + row + '][ col = ' + (col+i) + ']').text("\nH");
				}
				else if(currentTurn == 2)
				{
					$('.gridLeft .cell[ row = ' + row + '][ col = ' + (col+i) + ']').css("background-color", "rgb(255, 0, 0)");
					$('.gridLeft .cell[ row = ' + row + '][ col = ' + (col+i) + ']').text("\nH");
				}

				if(this.board[row][col+i] instanceof ship && this.board[row][col+i].isSunk()){
					$("#mode").text("You sunk your opponents 1x" + this.board[row][col+i].getSize() + " battleship!");
				}
				
				if(this.allSunk()){
					$('#endTurn').prop('disabled', true);
					console.log(`p${!boardNum+1} wins!`);
					//P2 wins!
					endGame(`Player ${!boardNum+1}`);
				}
				else
				{
					$('#endTurn').prop('disabled', false);
					$('#torpedo').prop('disabled', true);
					$('#multiShot').prop('disabled', true);
				}
				
			} 
			else if (outCome == 'M')
			{
				if(currentTurn == 1)
				{
					$('.gridRight .cell[ row = ' + row + '][ col = ' + (col+i) + ']').css("background-color", "rgb(0, 0, 255)");
					$('.gridRight .cell[ row = ' + row + '][ col = ' + (col+i) + ']').text("\nM");
				}
				else if(currentTurn == 2)
				{
					$('.gridLeft .cell[ row = ' + row + '][ col = ' + (col+i) + ']').css("background-color", "rgb(0, 0, 255)");
					$('.gridLeft .cell[ row = ' + row + '][ col = ' + (col+i) + ']').text("\nM");
				}
				if(!this.allSunk())
				{
					$('#endTurn').prop('disabled', false);
					$('#torpedo').prop('disabled', true);
					$('#multiShot').prop('disabled', true);
				}

			}
		}
	}

	/**
	*The attemptTorpedoShot function is provided a location to fire on, as well as what board is being
	*fired on. The function starts from the bottom of the board at the selected column and then shoots
	*each row upwards until it finds a ship or until it reaches the top of the board.
	*@param rowClicked An integer representing the row that was clicked on the board
	*@param col        An integer representing the column that was clicked on the board
	*@param boardNum An integer representing what board is being fired on.
	*@return None
	*/
	attemptTorpedoShot(rowClicked, col, boardNum) {
		console.log("CLICKED SQUARE:", rowClicked, col);
		let gridID = boardNum == 1 ? ".gridLeft" : ".gridRight";
		let playerAttacking = boardNum == 1 ? 2 : 1;

		if (this.board[rowClicked][col] == 1)
			return;

		$('#endTurn').prop('disabled', false);

		for (let row = 8; row >= 0; row--) {
			if (this.board[row][col] == 0) { // Found an empty space (or trap)... keep on going
				$(`${gridID} .cell[ row = ` + row + '][ col = ' + col + ']').css("background-color", "rgb(0, 0, 255)");
				$(`${gridID} .cell[ row = ` + row + '][ col = ' + col + ']').text("\nM");
				this.board[row][col] = 1;
				console.log("miss", row, col);

				continue;
			} else if (this.board[row][col] == 1 && this.board[row][col] instanceof ship) { // Hits ship that has been hit already.
				console.log("hit existing ship - exit early", row, col);

				break;
			} else if (this.board[row][col] instanceof ship) { // Found a new ship!
				let boat = this.board[row][col];
				let [rowHead, colHead] = boat.getHead();
				let distance = Math.abs((rowHead - row) + (col - colHead));

				if (boat.hits[distance] != 1) {
					boat.registerHit(distance);
					// Handle the hit logic
					$(`${gridID} .cell[ row = ` + row + '][ col = ' + col + ']').css("background-color", "rgb(255, 0, 0)");
					$(`${gridID} .cell[ row = ` + row + '][ col = ' + col + ']').text("\nH");

					if (this.board[row][col] instanceof ship && this.board[row][col].isSunk()) {
						$("#mode").text("You sunk your opponents 1x" + this.board[row][col].getSize() + " battleship!");
					}

					if (this.allSunk()) {
						console.log(`p${playerAttacking} wins!`);
						$('#endTurn').prop('disabled', true);
						endGame(`Player ${playerAttacking}`);
					}
				}

				console.log("found a ship!", row, col);
				break;
			} else if (this.board[row][col] instanceof trap) { // Hit a trap square
				let boardBeingAttacted = eval('p' + boardNum + 'Board');
				let boardThatAttacted = eval('p' + playerAttacking + 'Board');
				let gridIDThatAttacted = gridID == ".gridRight" ? ".gridLeft" : ".gridRight";

				let trapCenter = boardBeingAttacted.boardState(row, col).getPos();
				for (let i = 0; i < trapSize * 2 + 1; i++) {
					for (let j = 0; j < trapSize * 2 + 1; j++) {
						boardBeingAttacted.clear(trapCenter[0] - trapSize + i, trapCenter[1] - trapSize + j)
						console.log("clearing traps nine times")
						outcome = boardThatAttacted.attemptedShot(trapCenter[0] - trapSize + i, trapCenter[1] - trapSize + j)
						if (outcome == 'H') {
							$(`${gridIDThatAttacted} .cell[ row = ` + (trapCenter[0] - trapSize + i) + '][ col = ' + (trapCenter[1] - trapSize + j) + ']').css("background-color", "rgb(255, 0, 0)");
							$(`${gridIDThatAttacted} .cell[ row = ` + (trapCenter[0] - trapSize + i) + '][ col = ' + (trapCenter[1] - trapSize + j) + ']').text("\nH");
							hasShot = true;

							if (boardThatAttacted.board[trapCenter[0] - trapSize + i][trapCenter[1] - trapSize + j] instanceof ship && boardThatAttacted.board[trapCenter[0] - trapSize + i][trapCenter[1] - trapSize + j].isSunk()) {
								$("#mode").text("Your opponents trap sunk your 1x" + boardThatAttacted.board[trapCenter[0] - trapSize + i][trapCenter[1] - trapSize + j].getSize() + " battleship!");
							}
							$('#endTurn').prop('disabled', false);
							$('#torpedo').prop('disabled', true);
							$('#multiShot').prop('disabled', true);
							if (boardThatAttacted.allSunk()) {
								console.log(`p${playerAttacking} wins!`);
								endGame(`Player ${playerAttacking}`);
							}
						}
						else if (outcome == 'M') {
							$(`${gridIDThatAttacted} .cell[ row = ` + (trapCenter[0] - trapSize + i) + '][ col = ' + (trapCenter[1] - trapSize + j) + ']').css("background-color", "rgb(0, 0, 255)");
							$(`${gridIDThatAttacted} .cell[ row = ` + (trapCenter[0] - trapSize + i) + '][ col = ' + (trapCenter[1] - trapSize + j) + ']').text("\nM");
							hasShot = true;
							$('#endTurn').prop('disabled', false);
							$('#torpedo').prop('disabled', true);
							$('#multiShot').prop('disabled', true);
						}
					}
				}
				$("#mode").text("You've fallen into their trap!")

				//count hitting the trapsquare as a miss.
				$(`${gridID} .cell[ row = ` + row + '][ col = ' + col + ']').css("background-color", "rgb(0, 0, 255)");
				$(`${gridID} .cell[ row = ` + row + '][ col = ' + col + ']').text("\nM");
				this.board[row][col] = 1;

				break;
			}
		}

		$('#torpedo').prop('disabled', true);
		$('#multiShot').prop('disabled', true);
		hasShot = true;
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
	*The getViable tail function is provided a ship, which has a head location, and this function finds the indices of
	*possible tail locations by iterating in each direction from the head location, breaking if it hits a border or a ship.
	*@param ship A ship object used to locate the possible tail locations for
	*@return An array of indecies in form [int: row, int:col]
	*/
	getViableTail(ship){
		let [rowHead, colHead] = ship.getHead();
		let viableTails = [];
		let viable = true;
		let size = ship.getSize();

		for(let i = 0; i < ship.getSize(); i++){
			if(rowHead+i >= this.row || this.board[rowHead+i][colHead] != 0){	
				viable = false;
				break;
			}
		}
		if(viable == true){
			viableTails.push([rowHead+(ship.getSize()-1),colHead]);
		}
		viable = true;
		for(let i = 0; i < ship.getSize(); i++){
			if(rowHead-i < 0 || this.board[rowHead-i][colHead] != 0){
				viable = false;
				break;
			}
		}
		if(viable == true){
			viableTails.push([rowHead-(ship.getSize()-1),colHead]);
		}
		viable = true;
		for(let i = 0; i < ship.getSize(); i++){
			if(colHead+i >= this.column || this.board[rowHead][colHead+i] != 0){
				viable = false;
				break;
			}
		}
		if(viable == true){
			viableTails.push([rowHead,colHead+(ship.getSize()-1)]);
		}
		viable = true;
		for(let i = 0; i < ship.getSize(); i++){
			if(colHead-i < 0 || this.board[rowHead][colHead-i] != 0){
				viable = false;
				break;
			}
		}
		if(viable == true){
			viableTails.push([rowHead,colHead-(ship.getSize()-1)]);
		}
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

	/**
	 * used for fetching board states
	 * 
	 * @param {int} row row coordinate
	 * @param {int} col column coordinate
	 * @returns the value in that coordinate on the board
	 */
	boardState(row, col) {
		return this.board[row][col]
	}

	/**
	 * places a trap on the board
	 * 
	 * @param {object} trap trap object to place on board
	 * @param {int} row row coordinate
	 * @param {int} col column coordinate
	 * @param {int} size trap size
	 */
	placeTrap(trap, row, col, size) {
		for(let i=0;i<size*2+1;i++) {
			for(let j=0;j<size*2+1;j++) {
				this.board[row-size+i][col-size+j] = trap
			}
		}
	}

	/**
	 * clear board space at given coordinate
	 * 
	 * @param {int} row row coordinate
	 * @param {int} col column coordinate
	 */
	clear(row, col) {
		this.board[row][col] = 0
	}
	
}
