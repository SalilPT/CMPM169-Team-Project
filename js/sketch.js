let sidebar;
let globalBoard;

function setup() {
  createCanvas(500, 500);
  //sidebar = new Sidebar();
  //globalBoard =  new Board();
}

function draw() {
  background(220);
  //sidebar.display();
  //globalBoard.update()
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
        globalBoard.queuedCells.push({
            x: gridX,
            y: gridY,
            type: globalSidePanel.selectedCellType
        });
    }
}