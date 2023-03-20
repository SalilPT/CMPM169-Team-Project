class Board {
    constructor(width, height, cellWidth, updateRate) {
        this.width = width;
        this.height = height;
        this.cellWidth = cellWidth;
        this.widthInCells = floor(width / cellWidth);
        this.heightInCells = floor(height / cellWidth);
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
        // Wrap values around to be in range
        let xCoord = x >= 0 ? x % this.widthInCells : (this.widthInCells - 1) - ((-x - 1) % this.widthInCells);
        let yCoord = y >= 0 ? y % this.heightInCells : (this.heightInCells - 1) - ((-y - 1) % this.heightInCells);
        return this.cellGrid[xCoord][yCoord];
    }

    setCell(x,y,type, stats = {explosionTimeLeft: 3}) {
        this.nextCellGrid[x][y].type = type;
        this.nextCellGrid[x][y].stats = stats;
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
        for(let i = 0; i < this.widthInCells; i++){
            let row = new Array(this.heightInCells);
            for (let j = 0; j < row.length; j++){
                row[j] = new Cell({x: i, y: j}, "dead", this, {explosionTimeLeft: 3});
            }
            newGrid.push(row);
        }
        return newGrid;
    }

    update() {
        // check it is paused and in the correct update cycle based on update rate
        if (!this.isPaused && (this.updateRateCounter % this.updateRate == 0)) {
            // loop through this.cellGrid and call update for each cell
            for(let i = 0; i < this.widthInCells; i++){
                for (let j = 0; j < this.cellGrid[i].length; j++){
                    this.cellGrid[i][j].update();
                }
            }
            // loop over this.queuedCells array and assign to given position in next grid
            for(let i = 0; i < this.queuedCells.length; i++){
                this.nextCellGrid[this.queuedCells[i].coords.x][this.queuedCells[i].coords.y] = this.queuedCells[i];
            }
            this.queuedCells = [];
            // draw each cell in the next grid
            for(let i = 0; i < this.widthInCells; i++){
                for (let j = 0; j < this.nextCellGrid[i].length; j++){
                    this.nextCellGrid[i][j].draw();
                }
            }
            // assign current grid to be the next cell grid
            this.cellGrid = this.nextCellGrid;
            // assign next cell grid to a new grid
            this.nextCellGrid = this.build2dCellArr();
        }
        else if (this.isPaused) {
            // loop over this.queuedCells array and assign to given position in next grid
            for(let i = 0; i < this.queuedCells.length; i++){
                this.cellGrid[this.queuedCells[i].coords.x][this.queuedCells[i].coords.y] = this.queuedCells[i];
            }
            this.queuedCells = [];
            // draw each cell in the current grid
            for(let i = 0; i < this.widthInCells; i++){
                for (let j = 0; j < this.cellGrid[i].length; j++){
                    this.cellGrid[i][j].draw();
                }
            }
        }
        else if ((this.updateRateCounter % this.updateRate != 0)) {
            // draw each cell in the current grid
            for(let i = 0; i < this.widthInCells; i++){
                for (let j = 0; j < this.cellGrid[i].length; j++){
                    this.cellGrid[i][j].draw();
                }
            }
        }
        this.updateRateCounter++;
    }
}

class Cell {
    static CELL_COLORS;

    constructor(coords, type, board, stats) {
        this.coords = coords;
        this.type = type; // enum? normal, minePlacing, lifePlacing, lifeSeed, mine, explosion, DEAD
        this.board = board;
        this.stats = stats; // set stats.explosionTimeLeft to 3

        Cell.CELL_COLORS = {
            "dead": color(0),
            "normal": color(255),
            "minePlacing": color("yellow"),
            "lifePlacing": color("green"),
            "mine": color(64),
            "lifeSeed": color("pink"),
            "explosion": color("orange")
        };
    }

    draw() {
        fill(Cell.CELL_COLORS[this.type]);
        let cellWidth = this.board.cellWidth;
        rect((this.coords.x * cellWidth), (this.coords.y * cellWidth), cellWidth);
    }

    getNeighboringCells() {
        /*
        Uses the board property to return an array of length 8 of the neighboring cells (objects of the class Cell).
        The neighboring cells are added left-to-right, top-to-bottom.
        */
        let startX = this.coords.x;
        let startY = this.coords.y;
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

    setNext(type, stats = {explosionTimeLeft: 3}) {
        // calls board setCell method to set cell in the next round
        this.board.setCell(this.coords.x, this.coords.y, type, stats);
    }

    update() {
        // Note: make sure cells are set in the nextCellGrid variable in the board for this method, NOT in the current cell.
        // Count the number of neighboring cells of type “normal”, “life-placing”, and “mine-placing”, and let that number be n.
        let neighbors = this.getNeighboringCells();
        let totalNeighbors = 0; // total number of cells
        let minePlacingNeighbors = 0;
        let lifePlacingNeighbors = 0;
        for (let i = 0; i < 8; i++) {
            let neighbor = neighbors[i];
            if (!(["normal", "minePlacing", "lifePlacing"].includes(neighbor.type))) {
                continue;
            }
            totalNeighbors++;
            if (neighbor.type == "minePlacing") {
                minePlacingNeighbors++;
            }
            if (neighbor.type == "lifePlacing") {
                lifePlacingNeighbors++;
            }
        }

        if (this.lookUpNext() == "explosion") {
            return;
        }

        switch (this.type) {
            case "dead":
                // If this is a dead cell, first check if it’s already set to be a cell in the following board state. If so, skip the remaining update procedure for this cell type.
                // If not, then first check the surrounding eight cells for any mine-placing or life-placing cells. If n1 or n4, keep this cell dead for the next board state.
                // If there are no life-placing or mine-placing cells, then update this cell in the same way as one would in Conway’s Game of Life (using normal cells).
                // Otherwise, see if there’s any life-placing cells in the neighboring cells. Count the number of life-placing cells and mine-placing cells in the neighboring cells. If the number of life-placing cells and number of mine-placing cells are unequal, set this cell to be type with more surrounding it (e.g. two mine-placing and one life-placing neighbors means the dead cell becomes a mine-placing cell). If the number of life-placing and mine-placing cells are equal, set this dead cell to be a normal cell

                // Check that this cell hasn't been set yet
                if (this.lookUpNext() != "dead") {
                    break;
                }

                if (totalNeighbors != 3 && totalNeighbors != 4) {
                    // this cell will still be dead next round
                    this.setNext("dead");
                    break;
                }

                // Special case when totalNeighbors equals 4
                if (totalNeighbors == 4) {
                    if (minePlacingNeighbors > 0 && minePlacingNeighbors >= lifePlacingNeighbors) {
                        this.setNext("minePlacing");
                    }
                    else {
                        this.setNext("dead");
                    }
                    break;
                }

                // totalNeighbors equals 3
                if (minePlacingNeighbors > 0 && minePlacingNeighbors >= lifePlacingNeighbors) {
                    this.setNext("minePlacing");
                }
                else if (lifePlacingNeighbors > minePlacingNeighbors) {
                    // this will be a life placing cell
                    this.setNext("lifePlacing");
                }
                // Only normal cells
                else {
                    // this will be a normal cell
                    this.setNext("normal");
                }
                break;
            case "normal":
                // do base logic for all living cells
                if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                    // this cell will be dead next round
                    this.setNext("dead");
                }
                else if (totalNeighbors == 2 || totalNeighbors == 3) {
                    this.setNext("normal");
                }
                break;
            case "minePlacing":
                // If this cell is a mine-placing cell, then count the number of neighbors just like in the original game. If n>=5, set this cell to be a mine.
                if (totalNeighbors >= 5) {
                    // this cell will be a mine
                    this.setNext("mine");
                    break;
                }

                if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                    // this cell will be dead next round
                    this.setNext("dead");
                }
                else if (totalNeighbors == 2 || totalNeighbors == 3) {
                    this.setNext("minePlacing");
                }
                break;
            case "lifePlacing":
                // If this cell is a life-placing cell, then count the number of neighbors just like in the original game.
                // If the number of neighboring cells is 0 or 1, set this cell to be a life seed if this cell isn’t set to be an explosion cell in the following board state.
                if (totalNeighbors <= 1 && this.lookUpNext() != "explosion") {
                    // this cell will be a life seed
                    this.setNext("lifeSeed");
                    break;
                }

                if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                    // this cell will be dead next round
                    this.setNext("dead");
                }
                else if (totalNeighbors == 2 || totalNeighbors == 3) {
                    this.setNext("normal");
                }
                break;
            case "mine":
                if (totalNeighbors == 2 || totalNeighbors == 3) {
                    // this cell will be an explosion
                    this.setNext("explosion");
                    // set all neighbors to also be explosions (3 x 3 AoE)
                    for (let i = 0; i < 8; i++) {
                        neighbors[i].setNext("explosion", {explosionTimeLeft: 3}); // NOTE: make sure explosionTimeLeft is getting set
                    }
                    break;
                }

                // This mine hasn't been set off
                this.setNext("mine");
                break;
            case "lifeSeed":
                // If this is a life seed cell and n=3, then make a plus shape of 5 life-placing cells centered on this cell,
                // overwriting cells of any type in the next board state except “explosion”. Shape: [[0,1,0],[1,1,1],[0,1,0]]
                if (totalNeighbors == 0 || totalNeighbors == 3) {
                    // choose plus shape 5 cells to become life-placing type IF THEY AREN'T ALREADY EXPLOSION; overwrite all other types
                    for (let i = 0; i < 8; i++) {
                        // plus shape
                        if (!([1, 3, 4, 6].includes(i))) {
                            continue;
                        }

                        if (neighbors[i].lookUpNext() == "explosion") {
                            continue;
                        }
                        // not explosion
                        neighbors[i].setNext("lifePlacing");
                    }
                    this.setNext("lifePlacing"); // set self to life placing to complete plus shape
                }
                break;
            case "explosion":
                // If this is an explosion cell, then check its explosionTimeLeft stat. If it’s 0, then turn this cell into a dead cell.
                if (this.stats.explosionTimeLeft <= 0) {
                    this.setNext("dead");
                }
                else {
                    // Otherwise, keep this cell as an explosion cell, but decrement the explosionTimeLeft stat by 1.
                    this.setNext("explosion", {explosionTimeLeft: this.stats.explosionTimeLeft - 1});
                }
                break;
            default:
                throw new Error(this.type + "is an invalid cell type!");
        }
    }

    setFromConfig(config) {
        // type, stats
        this.type = config.type;
        this.stats = config.stats;
    }
}

class SidePanel {
    constructor() {
        this.buttonTextArray = ["Normal", "Dead", "Mine-Placing", "Life-Placing", "Mine", "Life Seed", "Explosion", "Pause / Play"];
        this.selectableCellTypes = ["normal", "dead", "minePlacing", "lifePlacing", "mine", "lifeSeed", "explosion", "Pause / Play"];
        this.iconColors = ["#FFFFFF","#000000","yellow","green", 64, "pink", "orange"];
        this.buttonToolTipsText = [
            "Normal Cell:\n\n True to Conway's original Game of Life rules. Treats mine-placing cells and life-placing cells as neighbors.",
            "Dead Cell:\n\n Can become a normal, mine-placing, or life-placing cell based on its neighbors. Stays a dead cell if it doesn't have 3 or 4 neighbors. " + 
            "If it has 4 neighbors and the number of mine-placing neighbors is >= the number of life-placing neighbors, it becomes a mine-placing cell; otherwise, it stays dead. " +
            "If it has 3 neighbors and the number of mine-placing neighbors is >= the number of life-placing neighbors, it becomes a mine-placing cell; otherwise, it becomes a life-placing cell.",
            "Mine-Placing Cell:\n\n Special cell variation that places a mine if it has at least 5 neighbors.",
            "Life-Placing Cell:\n\n Special cell variation that places a life seed if it dies from underpopulation.",
            "Mine Cell:\n\n Cell type that blows up if it has 2 or 3 neighboring cells, converting all of its neighboring cells and itself into explosion cells.",
            "Life Seed Cell:\n\n Cell type that spawns a plus shape of life-placing cells if it has 0 or 3 neighboring cells.",
            "Explosion Cell:\n\n Cell type that lasts 3 board updates once spawned. Represents an explosion that dissipates over time.",
            "Play/Pause:\n\n Play or pause the simulation."
        ];

        this.selectedCellType = "normal";

        this.buttonWidth = 200;
        this.buttonHeight = 75;
        this.x = width - this.buttonWidth - 30;
        this.y = 0;
        this.toolTipsX = this.x - this.buttonWidth*2;
        this.toolTipsY = this.y;
        this.ToolTipsW = this.buttonWidth*2;
        this.ToolTipsH =  this.buttonHeight*3;
    }

    display() {
        noStroke();
        fill(220);
        //rect(this.x, this.y, this.buttonWidth, height, 10);

        for (let i = 0; i < this.buttonTextArray.length; i++) {
            fill("#A7BBEC");
            stroke("#003249");
            strokeWeight(2);
            textAlign(CENTER, CENTER);
            rectMode(CORNER);
            textSize(16);
            let buttonX = this.x;
            let buttonY = i * this.buttonHeight;
          
            // if pause/play move it farther down
            if (this.buttonTextArray[i] == "Pause / Play") {
                buttonY += this.buttonHeight;
            }

            // draw button boxes, if selected draw it with different border
            if (this.selectedCellType == this.selectableCellTypes[i]) {
                push();
                strokeWeight(5);
                stroke("#E1E5EE");
                rect(buttonX + 3, buttonY + 3, this.buttonWidth - 6, this.buttonHeight - 3, 10);
                pop();
            } else { 
                rect(buttonX + 3, buttonY + 3, this.buttonWidth - 6, this.buttonHeight - 3, 10);
            }

            // draw the cell icon and text inside the button, Play/Pause button has different style
            if (this.selectableCellTypes[i] != "Pause / Play") {
                fill(this.iconColors[i]);
                rectMode(CENTER);
                rect(buttonX + this.buttonWidth/2, buttonY + this.buttonHeight/3, this.buttonHeight/3, this.buttonHeight/3);

                fill(0);
                noStroke();
                text(this.buttonTextArray[i], buttonX + this.buttonWidth / 2, buttonY + this.buttonHeight / 1.3);
            } else { // for play pause button
                fill("#000000");
                noStroke();
                text(this.buttonTextArray[i], buttonX + this.buttonWidth / 2, buttonY + this.buttonHeight /2);
            }

            // draw tool tip if mouse is hovering over a button
            rectMode(CORNER);
            if (this.isMouseHovering(buttonX, buttonY, this.buttonWidth, this.buttonHeight)) {
                stroke("#020202");
                strokeWeight(2);
                fill("#A7BBECE0");
                rect(this.toolTipsX, this.toolTipsY, this.ToolTipsW, this.ToolTipsH, 10);
                fill("#000000");
                noStroke();
                text(this.buttonToolTipsText[i], this.toolTipsX, this.toolTipsY, this.ToolTipsW, this.ToolTipsH);
            }
        }
    }

    handleMouseClick() {
        // conditionals to detect which button is being clicked
        if (mouseX >= this.x && mouseX <= this.x + this.buttonWidth) {
            let buttonIndex = floor((mouseY - this.y) / this.buttonHeight);
            if (buttonIndex < 0 || buttonIndex >= (this.buttonTextArray.length + 1)) {
                return;
            }

            // if pressing the pause button
            if (this.buttonTextArray[buttonIndex - 1] == "Pause / Play") {
                this.pauseOrPlay();
            }
            else {
                // if pressing the space above pause/play return
                if (buttonIndex == 7) {
                    return;
                }
                // otherwise, set property to a cell
                this.setSelectedType(this.selectableCellTypes[buttonIndex]);
                console.log(this.selectedCellType + " selected");
            }
        }
    }

    // given a position on the canvas(x,y), with a given width and h height
    // check if mouse is hovering over the bounding square based on those parameters
    // returns true if it is over that postion
    // origin of bounding square is at top left
    isMouseHovering (x, y, w, h) {
        if (x < mouseX && mouseX < (x + w) && y < mouseY && mouseY < (y+h)){
            return true;
        } else {
            return false;
        }
    }

    setSelectedType(cellType) {
        this.selectedCellType = cellType;
    }

    // this function is called when the button is clicked, so if the
    // current state is play, this is called when clicked and switches
    // to paused and vice versa.
    pauseOrPlay() {
        // grab board variable isPaused
        if (globalBoard.isPaused == true) {
            globalBoard.play();
        } else {
            globalBoard.pause();
        }
    }
}
