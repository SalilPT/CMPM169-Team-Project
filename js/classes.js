class Board {
    constructor() {
    }
}

class Cell {
    constructor() {
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
