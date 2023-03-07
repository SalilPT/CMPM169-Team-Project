let globalSidePanel;
let globalBoard;

function setup() {
    createCanvas(500, 500);
    rectMode(CORNER);

    globalSidePanel = new SidePanel();
    globalBoard = new Board(400, 400, 10, 4);
}

function draw() {
    background(220);
    globalSidePanel.display();
    globalBoard.update();
}

function mousePressed(event) {
    let canvasBoundingRect = event.target.getBoundingClientRect();
    let canvasXStart = canvasBoundingRect.x;
    let canvasYStart = canvasBoundingRect.y;
    let xRelativeToBoard = event.x - canvasXStart;
    let yRelativeToBoard = event.y - canvasYStart;

    // Mouse is over the board
    if (event.target.tagName == "CANVAS"
        && xRelativeToBoard >= 0 && xRelativeToBoard <= globalBoard.width
        && yRelativeToBoard >= 0 && yRelativeToBoard <= globalBoard.height) {
        // Round mouse position to the nearest grid coordinate
        let gridX = floor((xRelativeToBoard) / globalBoard.cellWidth);
        let gridY = floor((yRelativeToBoard) / globalBoard.cellWidth);
        globalBoard.queuedCells.push(new Cell({x: gridX, y: gridY}, globalSidePanel.selectedCellType, globalBoard, {explosionTimeLeft: 3}));
    }
}

function mouseClicked() {
    globalSidePanel.handleMouseClick();
}
