let globalSidePanel;
let globalBoard;
let updateRateSlider;

let drawCellHighlight = () => {}; // anonymous function

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
    //globalSidePanel.display();
    globalBoard.update();
    globalSidePanel.display();

    drawCellHighlight();

    globalBoard.updateRate = updateRateSlider.value();

    fill(0); // slider label
    textSize(16);
    text("Speed", updateRateSlider.position().x * 1.03, updateRateSlider.position().y * 0.95);
}

function mousePressed(event) {
    let mouseInfo = getMouseInfoFromEvent(event);

    if (mouseInfo.mouseIsOverBoard) {
        globalBoard.queuedCells.push(new Cell({x: mouseInfo.gridX, y: mouseInfo.gridY}, globalSidePanel.selectedCellType, globalBoard, {explosionTimeLeft: 3}));
    }
}

function mouseDragged(event) {
    let mouseInfo = getMouseInfoFromEvent(event);

    if (mouseInfo.mouseIsOverBoard) {
        globalBoard.queuedCells.push(new Cell({x: mouseInfo.gridX, y: mouseInfo.gridY}, globalSidePanel.selectedCellType, globalBoard, {explosionTimeLeft: 3}));
    }
}

function mouseClicked() {
    globalSidePanel.handleMouseClick();
}

function windowResized() {
    // resizeCanvas(windowWidth, windowHeight);

}

function mouseMoved(event) {
    // Wait for board to load
    if (globalBoard == undefined) {
        return;
    }

    let mouseInfo = getMouseInfoFromEvent(event);

    if (!mouseInfo.mouseIsOverBoard) {
        drawCellHighlight = () => {};
        return;
    }

    let cellColor = Cell.CELL_COLORS[globalSidePanel.selectedCellType];
    let highlightColor = color(cellColor.toString()); // Make a new color object
    highlightColor.setAlpha(184);
    let cellWidth = globalBoard.cellWidth;
    drawCellHighlight = () => {
        fill(highlightColor);
        rect((mouseInfo.gridX * cellWidth), (mouseInfo.gridY * cellWidth), cellWidth);
    };
}

function getMouseInfoFromEvent(event) {
    let canvasBoundingRect = event.target.getBoundingClientRect();
    let canvasXStart = canvasBoundingRect.x;
    let canvasYStart = canvasBoundingRect.y;

    let xRelativeToBoard = event.x - canvasXStart;
    let yRelativeToBoard = event.y - canvasYStart;

    let mouseIsOverBoard = (event.target.tagName == "CANVAS"
    && xRelativeToBoard >= 0 && xRelativeToBoard < globalBoard.width
    && yRelativeToBoard >= 0 && yRelativeToBoard < globalBoard.height);

    // Round mouse position to the nearest grid coordinate
    let gridX = floor((xRelativeToBoard) / globalBoard.cellWidth);
    let gridY = floor((yRelativeToBoard) / globalBoard.cellWidth);

    let result = {
        xRelativeToBoard: xRelativeToBoard,
        yRelativeToBoard: yRelativeToBoard,
        mouseIsOverBoard: mouseIsOverBoard,
        gridX: gridX,
        gridY: gridY
    };

    return result;
}

