let grid = document.getElementById("grid");
let displayMsg = document.getElementById("message");
let testMode = false; //If I turn this variable to true then I can see where the mines are
let minesSymbol = "\uD83D\uDCA3";
let flagSymbol = "&#x1F6A9;";
let bombs = 0;
let gridSize = 0;
let time = 0, timer = 0;

//Set the difficulty
document.getElementById("easy").addEventListener("click", function() {
  setDifficulty("easy");
});
document.getElementById("medium").addEventListener("click", function() {
  setDifficulty("medium");
});
document.getElementById("hard").addEventListener("click", function() {
  setDifficulty("hard");
});

function setDifficulty(difficulty) {
  // Change the game's difficulty based on the input
  if (difficulty == "easy"){
     gridSize = 10;
     bombs = 20;
  } else if(difficulty == "medium"){
     gridSize = 20;
     bombs = 60;
  } else if(difficulty == "hard"){
     gridSize = 30;
     bombs = 120;
  }
  generateGrid();
  timer = setInterval(function(){
    //Start the timer
    ++time;
    document.getElementById("timer").textContent = "Your time: " + time;
  }, 1000);
}

function generateGrid() {
  //Generate grid
  grid.innerHTML = "";
  for (let i = 0; i < gridSize; ++i) {
    row = grid.insertRow(i);
    for (let j = 0; j < gridSize; ++j) {
      cell = row.insertCell(j);
      cell.onclick = function() {
         clickCell(this); 
      };
      cell.addEventListener("contextmenu", function(e) {
        //Event listener for right click
        e.preventDefault();
        addFlag(this);
      });
      var mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  addMines();
}

function addMines() {
  //Add mines randomly
  for (let i = 0; i < bombs; ++i) {
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);
    let cell = grid.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
    if (testMode) { 
      cell.innerHTML = minesSymbol;
    }
  }
}

function addFlag(cell) {
  //Add flag on right click
  if (cell.innerHTML == "") {
    cell.innerHTML = flagSymbol;
  } else if (cell.innerHTML == flagSymbol) {
    cell.innerHTML = "";
  }
}


function revealMines() {
  //Highlight all mines 
  for (let i = 0; i < gridSize; ++i) {
    for (let j = 0; j < gridSize; ++j) {
      let cell = grid.rows[i].cells[j];
      if (cell.getAttribute("data-mine") == "true") { 
        cell.className = "mine";
        cell.innerHTML = minesSymbol;
      }
    }
  }
  // Stop the Timer
  clearInterval(timer);
}

function checkLevelCompletion() {
  let levelComplete = true;
  for (let i = 0; i < gridSize; ++i) {
    for (let j = 0; j < gridSize; ++j) {
      if ((grid.rows[i].cells[j].getAttribute("data-mine") == "false") && (grid.rows[i].cells[j].innerHTML == "")) { 
        levelComplete = false;
      }
    }
  }
  if (levelComplete) {
    displayMsg.innerHTML = "Congratulations, You Win!";
    revealMines();
    cell.innerHTML = minesSymbol;
  }
}

function clickCell(cell) {
  //Check if the end-user clicked on a mine
  if (cell.getAttribute("data-mine") == "true") {
    revealMines();
    cell.innerHTML = minesSymbol;
    displayMsg.innerHTML = "Game Over";
  } else {
    cell.className = "clicked";
    //Count and display the number of adjacent mines
    let mineCount = 0;
    let cellRow = cell.parentNode.rowIndex;
    let cellCol = cell.cellIndex;
    for (let i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,gridSize - 1); ++i) {
      for (let j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,gridSize - 1); ++j) {
        if (grid.rows[i].cells[j].getAttribute("data-mine") == "true") {
          ++mineCount;
        }
      }
    }
    cell.innerHTML = mineCount;
    if (mineCount == 0) { 
      //Reveal all adjacent cells as they do not have a mine
      for (let i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,gridSize - 1); ++i) {
        for (let j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,gridSize - 1); ++j) {
          if (grid.rows[i].cells[j].innerHTML == "") { 
            clickCell(grid.rows[i].cells[j]); 
          } 
        }
      }
    }
    checkLevelCompletion();
  }
}

function restart() {
  location.reload();
}
