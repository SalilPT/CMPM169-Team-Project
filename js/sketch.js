let globalSidePanel;
let globalBoard;
let updateRateSlider;

let drawCellHighlight = () => {}; // anonymous function

function setup() {
    let canvas = createCanvas(1000, 900);
    rectMode(CORNER);

    globalSidePanel = new SidePanel();
    globalBoard = new Board(800, 800, 10, 4);

    updateRateSlider = createSlider(1, 50, 10, 5);
    updateRateSlider.position(40, height - updateRateSlider.size().height);
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
    text("Speed", 60, updateRateSlider.position().y - 20);
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