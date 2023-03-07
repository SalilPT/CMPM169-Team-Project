function setup() {
}

function draw() {
}

function mousePressed(event) {
    let canvasBoundingRect = event.target.getBoundingClientRect();
    let canvasXStart = canvasBoundingRect.x;
    let canvasYStart = canvasBoundingRect.y;
    let xRelativeToBoard = event.x + canvasXStart;
    let yRelativeToBoard = event.y + canvasYStart;

    // Mouse is over the board
    if (event.target.tagName == "CANVAS"
        && xRelativeToBoard >= 0 && xRelativeToBoard <= globalBoard.width
        && yRelativeToBoard >= 0 && yRelativeToBoard <= globalBoard.height) {
        // Round mouse position to the nearest grid coordinate
        let gridX = floor((xRelativeToBoard) / cellWidth);
        let gridY = floor((yRelativeToBoard) / cellHeight);
        globalBoard.queuedCells.push(new Cell(gridX, gridY, globalSidePanel.selectedCellType, {explosionTimeLeft: 3}));
    }
}