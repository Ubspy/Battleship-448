class AI {
    constructor(board) {
        this.board = board
    }

    placeShips() {

    }
}


/**
 * Generates random coordinates for a ship head and ship tail, given the length.
 * 
 * This function guarantees that the ship will fit within the dimensions of the board.
 * However, it is up to the caller to check that the returned ship coordinates do not
 * overlap with another ship already on the board.
 * 
 * @param length The length of the ship
 * @returns [head coordinates, tail coordinates], or, [[rowHead, colHead], [rowTail, colTail]]
 */
function randomShip(length) {

    // To simplify things, we are only going to place the tail to the right of or below the head.
    // First, we need to pick an orientation, that way we know whether we need to leave extra 
    // room horizontally or vertically.

    let isHorizontal = Math.round(Math.random()); // 0 or 1

    let maxRowHead = 0;
    let maxColHead = 0;

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
        rowTail = rowHead;
        colTail = colHead + length;
    } else {
        rowTail = rowHead + length;
        colTail = colHead;
    }

    return [[rowHead, colHead], [rowTail, colTail]];
}