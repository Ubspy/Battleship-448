
class trap {

    /**
    * The constructer sets size, row, and column values
    * Size is a static value that can be changed here as desired
    * 
    * @param  size takes trap size
    * @param  row takes row coordinate
    * @param  col takes column coordinate
    * 
    * @return none
    */
    constructor(row, col, size) {
        this.size = size
        this.row = row
        this.col = col
    }
    
    /**
     * Gets trap location
     * 
     * @returns center location of trap
     */
    getPos() {
        return [parseInt(this.row), parseInt(this.col)]
    }
}