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
		return 'I';//not a valid shot 
	}
	/**
	*The placeShip function is provided a ship, and an index in the array for the tail position
	*The function then uses the newShip's head location to iterate through the board and add
	*an instance of the ship in each of the indices from the head location to the tail location.
	*@param newShip A ship object to be placed onto the board
	*@return None
	*/
	placeShip(newShip){
		let [rowHead, colHead] = newShip.getHead()		
		this.shipArray.push(newShip);//adds the ship in the main array 
		
		if (newShip.orientation == 'h') {
			for (var i = 0; i < newShip.getSize(); i++) {
				this.board[rowHead][colHead + i] = newShip;
			}
		} else if (newShip.orientation == 'v') {
			for (var i = 0; i < newShip.getSize(); i++) {
				this.board[rowHead + i][colHead] = newShip;
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
	
}
