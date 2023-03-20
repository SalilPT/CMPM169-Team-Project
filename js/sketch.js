let globalSidePanel;
let globalBoard;
let updateRateSlider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CORNER);

    globalSidePanel = new SidePanel();
    globalBoard = new Board(width * 0.7, height * 0.98, 10, 10);

    updateRateSlider = createSlider(1, 20, 10);
    updateRateSlider.size(width / 10); // scale according to window size
    updateRateSlider.position(width - (updateRateSlider.size().width + width / 8), height - (height / 4));
    
}

function draw() {
    background(220);
    globalSidePanel.display();
    globalBoard.update();

    globalBoard.updateRate = updateRateSlider.value();

    fill(0); // slider label
    textSize(16);
    text("Speed", updateRateSlider.position().x * 1.03, updateRateSlider.position().y * 0.95);
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

function windowResized() {
    // resizeCanvas(windowWidth, windowHeight);

}

