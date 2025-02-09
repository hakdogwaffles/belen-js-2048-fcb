// board will contain the current state of the board
let board;
let score = 0;

let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// we are going to contain array of arrays in board matrix

// function that will set the gameboard;

function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    //create the game board on the HTML document
    for(let r = 0; r< rows; r++){
        for(let c =0; c < columns; c++){

            let tile = document.createElement("div");

            tile.id = r + "-" + c;

            let num = board[r][c];
            updateTile(tile, num);

            document.getElementById("board").append(tile);
        }
    }

    setOne();
    setOne();

}

// function to update appearance of a tile based on its number

function updateTile(tile, num){

    //clear the tile
    tile.innerText = "";
    // clear the classList to avoid multiple classes
    tile.classList.value = "";

    tile.classList.add("tile");

    if(num > 0){
        tile.innerText = num;
        if(num <= 4096) {
            tile.classList.add("x" + num)
        }else{
            tile.classList.add("x8192");
        }
    }
}
// event that triggers when the web page finishes loading. Its like saying "wait until everything"
window.onload = function(){
    setGame();
}

function handleSlide(event){
    event.preventDefault();

    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){
        // if statement that will be based on which arrow key was pressed.

        if (event.code == "ArrowLeft" && canMoveLeft()){
            slideLeft();
            setOne();
        } else if ( event.code == "ArrowRight" && canMoveRight()){
            slideRight();
            setOne();
        } else if (event.code == "ArrowUp" && canMoveUp()){
            slideUp();
            setOne();
        } else if (event.code == "ArrowDown" && canMoveDown()){
            slideDown();
            setOne();
        }
    }

    document.getElementById('score').innerText = score;
    setTimeout(() => {
        if(hasLost()){
            alert("Game Over");
            restartGame();
            alert("Click any arrow key to restart");
        }else {
            checkWin();
        }
    }, 100);

}
function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;
    setOne();
}

//eventListener
document.addEventListener("keydown", handleSlide);

function slideLeft(){
    for (let r = 0; r < rows; r++){
        let row = board[r];
        let originalRow = row.slice();

        row = slide(row);
        //updating the current state of the board
        board[r] = row;

        // add for loop that will change the tiles.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r + "-" + c)
            let num = board[r][c];
            if(originalRow[c] != num && num != 0){
                tile.style.animation = "slide-from-right 0.3s"
                setTimeout(()=> {
                    tile.style.animation = ""
                }, 300)
            }
            updateTile(tile, num);
        }
    }
}
function slideRight(){
	for(let r  = 0; r < rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row = row.reverse();
		row = slide(row);
		row = row.reverse();

		board[r] = row;

		// Update the tiles
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" +c);
			let num = board[r][c];
			
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}
function slideUp(){
    for(let c = 0; c < columns; c++){
        // the elements of the col from the current iteration
        let col = board.map(row => row[c]);
        let originalCol = col.slice();
        col = slide(col);

        //update the id of the title
        for (let r = 0; r < rows; r++){
            board[r][c] =  col[r]

            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalCol[r] !== num && num !=0){
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout (() => {
                    tile.style.animation = "";
                }, 300)
            }
            updateTile(tile, num);
        }
    }
}
function slideDown(){
    for(let c = 0; c < columns; c++){
        let col = board.map(row => row[c]);
        let originalCol = col.slice();
        col = col.reverse();
        col = slide(col);
        col = col.reverse();

        for (let r = 0; r < rows; r++){
            board[r][c] =  col[r]

            let tile = document.getElementById(r + "-" + c);
            let num = board[r][c];
            if(originalCol[r] !== num && num !=0){
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout (() => {
                    tile.style.animation = "";
                }, 300)
            }
            updateTile(tile, num);
        }
    }
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row){
    row = filterZero(row);

    for (let i = 0; i < row.length; i++){
        if (row[i] == row[i+1]){
            row[i] *=2;
            row[i+1] = 0;

            score += row[i]
        }
    }
     row = filterZero(row);

     while (row.length < columns) {
        row.push(0)
     }
     return row;
}

// Create a function that will check if there is an empty or none in the board.

function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

//create a function called setOne()
//It will randomly create/add tile in the board

function setOne(){
    // early exit if there is no available slot for the tile:
    if(!hasEmptyTile()){
        return;
    }

    let found = false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r + "-" + c);
            updateTile(tile, board[r][c]);

            found = true;
        }
    }
}


//we are going to create a function that will check if there is a possible to move going left

function canMoveLeft(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if (board[r][c] != 0) {
                if(board[r][c] == board[r][c-1] || board[r][c-1] == 0){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(){
    for(let r = 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            if (board[r][c] != 0){
                if (board[r][c] == board[r][c+1] || board[r][c+1] == 0 ){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(){
	for(let c = 0; c < columns; c++){
		for(let r = 1; r <rows; r++){
			if(board[r][c] != 0){
				if(board[r-1][c] == 0 || board[r-1][c] == board[r][c]){
					return true;
				}
			}
		}
	}

	return false;
}

function canMoveDown(){
	for(let c=0; c<columns; c++){
		for(let r = rows - 2 ; r >= 0 ; r--){
			if(board[r][c] != 0){
				if(board[r+1][c] == 0 || board[r+1][c] == board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}

function checkWin(){
    for(let r = 0; r < rows; r++ ){
        for (let c = 0; c < columns; c++){
            if(board[r][c] ==2048 && is2048Exist == false){
                alert("You win! You got the 2048");
                is2048Exist = true;
            }else if(board[r][c] == 4096 && is4096Exist == false){
                alert("Your are unstoppable at 4096! You are fanstastically unstoppable")
                is4096Exist = true;
            }else if (board[r][c] == 8192 && is8192Exist == false){
                alert("Victory! You have reached 8192! You are awesome!");
                is8192Exist = true;
            }
        }
    }
}


//Function that will check if the user lost

function hasLost(){
    for(let r = 0; r < rows; r++ ){
        for (let c = 0; c < columns; c++){
            if(board[r][c] == 0) {
                return false;
            }
            let currentTile = board[r][c];
            if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile){
                return false;
                }
        }
    }
    return true
}
