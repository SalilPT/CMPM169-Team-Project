class Board {
    constructor(width, height, cellWidth, updateRate) {
        this.width = width;
        this.height = height;
        this.cellWidth = cellWidth;
        this.updateRate = updateRate;
        this.updateRateCounter = 0;
        this.isPaused = true;
        this.cellGrid = [];
        this.nextCellGrid = [];
        this.queuedCells = [];

        // build 2D array of cells and assign to this.cellGrid
        this.cellGrid = this.build2dCellArr();
        // build 2D array of cells and assign to this.nextCellGrid
        this.nextCellGrid = this.build2dCellArr();
    }

    getCellAt(x,y) {
        return this.cellGrid[x][y];
    }

    setCell(x,y,type) {
        this.nextCellGrid[x][y].type = type;
    }

    getPauseState() {
        return this.isPaused;
    }

    play(){
        this.isPaused = false;
    }

    pause() {
        this.isPaused = true;
    }

    // builds and and returns a 2d array
    build2dCellArr() {
        let newGrid = [];
        for(let i = 0; i < this.width; i++){
            let row = new Array(this.height);
            for (let j = 0; j < row.length; j++){
                row[j] = new Cell();
            }
            newGrid.push(row);
        }
        return newGrid;
    }

    update() {
        // check it is paused and in the correct update cycle based on update rate
        if (!this.isPaused && (this.updateRateCounter % this.updateRate == 0)) {
            // loop through this.cellGrid and call update for each cell
            for(let i = 0; i < this.width; i++){
                for (let j = 0; j < this.cellGrid[i].length; j++){
                    this.cellGrid[x][y].update();
                }
            }
            // loop over this.queuedCells array and assign to given position in next grid
            for(let i = 0; i < this.queuedCells.length; i++){
                this.nextCellGrid[this.queuedCells[i].x][this.queuedCells[i].y] = this.queuedCells[i];
            }
            this.queuedCells = [];
            // draw each cell in the next grid
            for(let i = 0; i < this.width; i++){
                for (let j = 0; j < this.nextCellGrid[i].length; j++){
                    this.nextCellGrid[x][y].draw();
                }
            }
            // assign current grid to be the next cell grid
            this.cellGrid = this.nextCellGrid;
            // assign next cell grid to a new grid
            this.nextCellGrid = this.build2dCellArr();
        }
        this.updateRateCounter++;
    }      
}

class Cell {
    constructor() {
    }
}

class SidePanel {
    constructor() {
    }
}