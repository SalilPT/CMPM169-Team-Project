class Board {
    constructor() {
    }
}

class Cell {
    constructor(coords, alive, type, board, stats) {
        this.coords = coords;
        this.coords = alive;
        this.coords = type; // enum? normal, minePlacing, lifePlacing, lifeSeed, mine, explosion
        this.coords = board;
        this.coords = stats;
    }

    die() {
        alive = false;
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
        let cellA = getCellAt(startX - 1, startY - 1);
        let cellB = getCellAt(startX, startY - 1);
        let cellC = getCellAt(startX + 1, startY - 1);
        let cellD = getCellAt(startX - 1, startY);
        let cellE = getCellAt(startX + 1, startY);
        let cellF = getCellAt(startX - 1, startY + 1);
        let cellG = getCellAt(startX, startY + 1);
        let cellH = getCellAt(startX + 1, startY + 1);
        return [cellA, cellB, cellC, cellD, cellE, cellF, cellG, cellH]; // NOTE: may or may not work
    }

    update() {
        // Note: make sure cells are set in the nextCellGrid variable in the board for this method, NOT in the current cell.
        // Count the number of neighboring cells of type “normal”, “life-placing”, and “mine-placing”, and let that number be n.
        let neighbors = getNeighboringCells();
        let totalNeighbors = 0; // total number of cells
        let normalNeighbors = 0;
        let bombNeighbors = 0;
        let lifeNeighbors = 0;
        for (i = 0; i < 8; i++) {
            let neighbor = neighbors[i];
            if (neighbor.type == "normal" || neighbor.type == "minePlacing" || neighbor.type == "lifePlacing") {
                totalNeighbors++;
                if (neighbor.type == "normal") {
                    normalNeighbors++;
                } else if (neighbor.type == "minePlacing") {
                    bombNeighbors++;
                } else {
                    lifeNeighbors++;
                }
            }
        }
        // If this is a dead cell, first check if it’s already set to be a cell in the following board state. If so, skip the remaining update procedure for this cell type. If not, then first check the surrounding eight cells for any mine-placing or life-placing cells. If n1 or n4, keep this cell dead for the next board state. 
        // If there are no life-placing or mine-placing cells, then update this cell in the same way as one would in Conway’s Game of Life (using normal cells). Otherwise, see if there’s any life-placing cells in the neighboring cells. Count the number of life-placing cells and mine-placing cells in the neighboring cells. If the number of life-placing cells and number of mine-placing cells are unequal, set this cell to be type with more surrounding it (e.g. two mine-placing and one life-placing neighbors means the dead cell becomes a mine-placing cell). If the number of life-placing and mine-placing cells are equal, set this dead cell to be a normal cell
        if (this.alive == false) {
            // look up self in nextCells array?
            if (!setInNextCells) {
                if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                    // TODO: this cell will still be dead next round
                } else {
                    // TODO: this cell will be alive next round
                    if (bombNeighbors > 0 || lifeNeighbors > 0) {
                        if (bombNeighbors > lifeNeighbors) {
                            // TODO: this will be a bomb placing cell
                        } else if (lifeNeighbors > bombNeighbors) {
                            // TODO: this will be a life placing cell
                        } else {
                            // TODO: this will be a normal cell
                        }
                    } else {
                        // only normal neighbors
                        // TODO: this will be a normal cell
                    }
                }
            }
        } else {
            
            
            if (this.type == "normal" || this.type == "minePlacing" || this.type == "lifePlacing") {
                
                // handle special cases
                if (this.type == "lifePlacing") {
                    // If this cell is a life-placing cell, then count the number of neighbors just like in the original game. 
                    // If the number of neighboring cells is 0 or 1, set this cell to be a life seed if this cell isn’t set to be an explosion cell in the following board state.
                    if (totalNeighbors <= 1) {
                        if (!setInNextCells) {
                            // TODO: this cell will be a life seed
                            setInNextCells = true;
                        }
                    }
                } else if (this.type == "minePlacing") {
                    // If this cell is a mine-placing cell, then count the number of neighbors just like in the original game. If n<=5, set this cell to be a mine.
                    if (totalNeighbors >= 5) {
                        // TODO: this cell will be a mine
                        setInNextCells = true;
                    }
                }

                if (!setInNextCells) {
                    // neither of the above cases
                    // do base logic for all living cells
                    if (totalNeighbors <= 1 || totalNeighbors >= 4) {
                        // TODO: this cell will be dead next round
                    }
                }
            } else {
                // this is a ground cell, not a living cell
                if (this.type == "mine") {
                    // If this is a mine cell and n=3, then turn this cell and many nearby cells to be of type “explosion”.
                    if (totalNeighbors == 3) {
                        // TODO: this cell will be an explosion
                        // TODO: randomly choose 5 to 7 neighbors to be explosion type
                    }
                } else if (this.type == "lifeSeed") {
                    // If this is a life seed cell and n=3, then make a plus shape of 5 life-placing cells centered on this cell, 
                    // overwriting cells of any type in the next board state except “explosion”. Shape: [[0,1,0],[1,1,1],[0,1,0]]
                    if (totalNeighbors == 3) {
                        // TODO: choose plus shape 5 cells to become life-placing type IF THEY AREN'T ALREADY EXPLOSION; overwrite all other types
                    }
                } else {
                    // If this is an explosion cell, then check its explosionTimeLeft stat. If it’s 0, then turn this cell into a dead cell. 
                    if (this.stats.explosionTimeLeft <= 0) {
                        // TODO: this cell will be dead
                    } else {
                        // Otherwise, keep this cell as an explosion cell, but decrement the explosionTimeLeft stat by 1.
                        this.stats.explosionTimeLeft--;
                    }
                }
            }
        }
    }

    setFromConfig(config) {
        // alive, type, stats
        this.alive = config.alive;
        this.type = config.type;
        this.stats = config.stats;
    }
}

class SidePanel {
    constructor() {
    }
}