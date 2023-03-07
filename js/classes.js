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

    // builds and and returns a 2d array of cells
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
                    this.cellGrid[i][j].update();
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
                    this.nextCellGrid[i][j].draw();
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
    constructor(coords, type, board, stats) {
        this.coords = coords;
        this.coords = type; // enum? normal, minePlacing, lifePlacing, lifeSeed, mine, explosion, DEAD
        this.coords = board;
        this.coords = stats; // set stats.explosionTimeLeft to 3
    }

    getNeighboringCells() {
        /*
        Uses the board property to return an array of length 8 of the neighboring cells (objects of the class Cell). 
        The neighboring cells are added left-to-right, top-to-bottom.
        */
        let startX = coords.x;
        let startY = coords.y;
        // board lookup coordinates
        // this is almost definitely a stupid way to do this but idk how to make it a for loop
        let cellA = this.board.getCellAt(startX - 1, startY - 1);
        let cellB = this.board.getCellAt(startX, startY - 1);
        let cellC = this.board.getCellAt(startX + 1, startY - 1);
        let cellD = this.board.getCellAt(startX - 1, startY);
        let cellE = this.board.getCellAt(startX + 1, startY);
        let cellF = this.board.getCellAt(startX - 1, startY + 1);
        let cellG = this.board.getCellAt(startX, startY + 1);
        let cellH = this.board.getCellAt(startX + 1, startY + 1);
        return [cellA, cellB, cellC, cellD, cellE, cellF, cellG, cellH]; // NOTE: may or may not work; idk how the syntax works
    }

    lookUpNext() {
        // used to find what the cell will be in the next round
        // returns the cell's type
        return this.board.nextCellGrid[this.coords.x][this.coords.y].type;
    }

    setNext(type) {
        // calls board setCell method to set cell in the next round
        this.board.setCell(this.coords.x, this.coords.y, type);
    }

    update() {
        // Note: make sure cells are set in the nextCellGrid variable in the board for this method, NOT in the current cell.
        // Count the number of neighboring cells of type “normal”, “life-placing”, and “mine-placing”, and let that number be n.
        let neighbors = getNeighboringCells();
        let totalNeighbors = 0; // total number of cells
        let bombNeighbors = 0;
        let lifeNeighbors = 0;
        for (i = 0; i < 8; i++) {
            let neighbor = neighbors[i];
            if (neighbor.type == "normal" || neighbor.type == "minePlacing" || neighbor.type == "lifePlacing") {
                totalNeighbors++;
                if (neighbor.type == "minePlacing") {
                    bombNeighbors++;
                } else if (neighbor.type == "lifePlacing") {
                    lifeNeighbors++;
                }
            }
        }
        // If this is a dead cell, first check if it’s already set to be a cell in the following board state. If so, skip the remaining update procedure for this cell type. 
        // If not, then first check the surrounding eight cells for any mine-placing or life-placing cells. If n1 or n4, keep this cell dead for the next board state. 
        // If there are no life-placing or mine-placing cells, then update this cell in the same way as one would in Conway’s Game of Life (using normal cells). 
        // Otherwise, see if there’s any life-placing cells in the neighboring cells. Count the number of life-placing cells and mine-placing cells in the neighboring cells. If the number of life-placing cells and number of mine-placing cells are unequal, set this cell to be type with more surrounding it (e.g. two mine-placing and one life-placing neighbors means the dead cell becomes a mine-placing cell). If the number of life-placing and mine-placing cells are equal, set this dead cell to be a normal cell
        if (this.type == "dead") {
            // look up self in nextCells array?
            if (this.lookUpNext() != "normal" && this.lookUpNext() != "minePlacing" && this.lookUpNext() != "lifePlacing") {
                // this cell hasn't been set yet
                if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                    // this cell will still be dead next round
                    this.setNext("dead");
                } else {
                    if (bombNeighbors > 0 || lifeNeighbors > 0) {
                        if (bombNeighbors > lifeNeighbors) {
                            // this will be a bomb placing cell
                            this.setNext("bombPlacing");
                        } else if (lifeNeighbors > bombNeighbors) {
                            // this will be a life placing cell
                            this.setNext("lifePlacing");
                        } else {
                            // this will be a normal cell
                            this.setNext("normal");
                        }
                    } else {
                        // only normal neighbors
                        // this will be a normal cell
                        this.setNext("normal");
                    }
                }
            }
        } else {
            
            if (this.type == "normal" || this.type == "minePlacing" || this.type == "lifePlacing") {
                
                // handle special cases
                if (this.type == "lifePlacing" && totalNeighbors <= 1) {
                    // If this cell is a life-placing cell, then count the number of neighbors just like in the original game. 
                    // If the number of neighboring cells is 0 or 1, set this cell to be a life seed if this cell isn’t set to be an explosion cell in the following board state.
                    if (this.lookUpNext() != "explosion") {
                        // this cell will be a life seed
                        this.setNext("lifeSeed");
                    }
                } else if (this.type == "minePlacing" && totalNeighbors >= 5) {
                    // If this cell is a mine-placing cell, then count the number of neighbors just like in the original game. If n<=5, set this cell to be a mine.
                    
                    // this cell will be a mine
                    this.setNext("mine");
                } else {
                    // neither of the above cases
                    // do base logic for all living cells
                    if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                        // this cell will be dead next round
                        this.setNext("dead");
                    }
                }

            } else {
                // this is a ground cell, not a living cell
                if (this.type == "mine") {
                    // If this is a mine cell and n=3, then turn this cell and many nearby cells to be of type “explosion”.
                    if (totalNeighbors == 3) {
                        // this cell will be an explosion
                        this.setNext("explosion");
                        // set all neighbors to also be explosions (3 x 3 AoE)
                        for (i = 0; i < 8; i++) {
                            neighbors[i].setNext("explosion"); // NOTE: make sure explosionTimeLeft is getting set
                            neighbors[i].stats.explosionTimeLeft = 3;
                        }
                    }
                } else if (this.type == "lifeSeed") {
                    // If this is a life seed cell and n=3, then make a plus shape of 5 life-placing cells centered on this cell, 
                    // overwriting cells of any type in the next board state except “explosion”. Shape: [[0,1,0],[1,1,1],[0,1,0]]
                    if (totalNeighbors == 3) {
                        // choose plus shape 5 cells to become life-placing type IF THEY AREN'T ALREADY EXPLOSION; overwrite all other types
                        for (i = 0; i < 8; i++) {
                            if (i == 1 || i == 3 || i == 4 || i == 6) {
                                // plus shape
                                if (neighbors[i].lookUpNext() != "explosion") {
                                    // not explosion
                                    neighbors[i].setNext("lifePlacing");
                                }
                            }
                        }
                        this.setNext("lifePlacing"); // set self to life placing to complete plus shape
                    }
                } else {
                    // If this is an explosion cell, then check its explosionTimeLeft stat. If it’s 0, then turn this cell into a dead cell. 
                    if (this.stats.explosionTimeLeft <= 0) {
                        this.setNext("dead");
                    } else {
                        // Otherwise, keep this cell as an explosion cell, but decrement the explosionTimeLeft stat by 1.
                        this.setNext("explosion");
                        this.stats.explosionTimeLeft--;
                    }
                }
            }
        }
    }

    setFromConfig(config) {
        // type, stats
        this.type = config.type;
        this.stats = config.stats;
    }
}

class SideBar {
    constructor() {
        this.selectableCellTypes = ["Red", "Blue", "Green", "Mine", "Life", "Pause/\nPlay"];
        this.selectedCellType = "";
        
        this.buttonWidth = 75;
        this.buttonHeight = 50;
        this.x = width - this.buttonWidth;
        this.y = 0;
    }
    
    display() {
        noStroke();
        fill(200);
        rect(this.x, this.y, this.buttonWidth, height);
    
        for (let i = 0; i < this.selectableCellTypes.length; i++) {
            let buttonX = this.x;
            let buttonY = i * this.buttonHeight;
  
            fill(255);
            rect(buttonX + 3, buttonY + 3, this.buttonWidth - 6, this.buttonHeight - 3);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(16);
            text(this.selectableCellTypes[i], buttonX + this.buttonWidth / 2, buttonY + this.buttonHeight / 2);
        }
    }
      
    handleMouseClick() {
        // conditionals to detect which button is being clicked
        if (mouseX >= this.x && mouseX <= this.x + this.buttonWidth) {
            let buttonIndex = floor((mouseY - this.y) / this.buttonHeight);
            if (buttonIndex >= 0 && buttonIndex < this.selectableCellTypes.length) {
  
            // if pressing the pause button
                if (this.selectableCellTypes[buttonIndex] == "Pause\n/Play") {
                    this.pauseOrPlay();
                } else {
                    // otherwise, set property to a cell
                    this.setSelectedType(this.selectableCellTypes[buttonIndex]);
                    console.log(this.selectedCellType + " selected");
                }
            
            }
        }
    }
      
    setSelectedType(cell_type) {
        this.selectedCellType = cell_type;
    }
      
    // this function is called when the button is clicked, so if the
    // current state is play, this is called when clicked and switches
    // to paused and vice versa.
    pauseOrPlay() {
        // grab board variable isPaused
        if (board.isPaused == true) {
            board.play();
        } else {
            board.pause();
        }
    }
}
