// TODO:
// Make it so that you can't move while game is paused
// Reset button
// Add backwards L tetromino
// Have space be instant drop-down (have hovering icon)

document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid');
    const mini_grid = document.querySelector('.mini-grid');
    const width = 10;
    const height = 20;

    // create main grid
    for(let i = 0; i < width * height; i++) {
        const gridcell = document.createElement("div");
        grid.appendChild(gridcell);
    }

    // add bottom padding
    for(let i = 0; i < width; i++) {
        const paddingcell = document.createElement("div");
        paddingcell.classList.add("taken");
        grid.appendChild(paddingcell);
    }

    // create next-up grid
    for(let i = 0; i < width * height; i++) {
        const gridcell = document.createElement("div");
        mini_grid.appendChild(gridcell);
    }

    var squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#start-button');
    let timerId;

    const tetromino_names = [
        'lTetromino',
        'zTetromino',
        'tTetromino',
        'oTetromino',
        'iTetromino'
    ]
    
    
    const lTetromino = [
        [1, width + 1, width*2 + 1, 2],
        [width, width + 1, width + 2, 2*width + 2],
        [1, width + 1, width*2 + 1, width*2],
        [width, 2*width, 2*width + 1, 2*width + 2]
    ]

    const zTetromino = [
        [width*2, width*2 + 1, width + 1, width + 2],
        [0, width, width+1, width*2+1],
        [width*2, width*2 + 1, width + 1, width + 2],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [width, width+1, width+2, 1],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [1, width+1, width*2+1, width],
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetronimo = [
        [1, width+1, 2*width+1, 3*width+1],
        [width, width+1, width+2, width+3],
        [1, width+1, 2*width+1, 3*width+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetronimo];

    // top left corner of box containing tetromino
    let currentPosition = 4; 
    let currentRotation = 0;
    let score = 0;

    //randomly select a tetromino and its first rotation
    let tetromino_index = Math.floor(Math.random()*theTetrominoes.length);
    let next_tetromino_index = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[tetromino_index][currentRotation]; 

    // draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].classList.add(tetromino_names[tetromino_index]);
        })
    }

    // undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].classList.remove(tetromino_names[tetromino_index]);
        })
    }

    // assign functions to keyCodes
    function control(e) {
        if(e.code === 'KeyA') {
            moveLeft();
        } else if(e.code === 'KeyW') {
            rotate();
        } else if(e.code === 'KeyD') {
            moveRight();
        } else if(e.code === 'KeyS') {
            moveDown();
        }
    }

    document.addEventListener('keyup', control)

    // move down function
    function moveDown() {
        if(!freeze()) {
            undraw();
            currentPosition += width;
            draw();
        }
    }

    function freeze() {
        // if some index in current is taken, then this if statement is true
        if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            addScore();

            // start a new tetromino falling
            tetromino_index = next_tetromino_index;
            next_tetromino_index = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[tetromino_index][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            gameOver();
            return true;
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!isAtLeftEdge) currentPosition -= 1;

        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);
        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[tetromino_index][currentRotation];

        const isCrossingEdge = (current.some(index => (currentPosition + index) % width === width-1) &&
            current.some(index => (currentPosition + index) % width === 0));
        console.log(isCrossingEdge);
        
        const isOverlapping = current.some(index => squares[currentPosition + index].classList.contains("taken"))

        if(isCrossingEdge || isOverlapping) {
            currentRotation--;
            if(currentRotation === -1) currentRotation = current.length - 1;
            current = theTetrominoes[tetromino_index][currentRotation];
        }
        draw();
    }

    // show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    // the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth*2 + 1, 2], // l
        [displayWidth*2, displayWidth*2 + 1, displayWidth + 1, displayWidth + 2], // z
        [displayWidth*2, displayWidth*2+1, displayWidth*2+2, displayWidth+1], // t
        [displayWidth+1, displayWidth+2, displayWidth*2 + 1, displayWidth*2+2], // o
        [1, displayWidth+1, 2*displayWidth+1, 3*displayWidth+1], // i
    ];

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            for(let i = 0; i < tetromino_names.length; i++){
                square.classList.remove(tetromino_names[i]);
            }
        })
        upNextTetrominoes[next_tetromino_index].forEach(index => {
            displaySquares[displayIndex+index].classList.add("tetromino");
            displaySquares[displayIndex+index].classList.add(tetromino_names[next_tetromino_index]);
        })
    }


    // add functionality to the button
    startButton.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 200);
            displayShape();
        }
    })

    // add score
    function addScore() {
        for (let i = 0; i < width*height-1; i += width) {
            const row = []
            for(let j = 0; j < width; j++){
                row.push(i+j);
            }

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    for(let i = 0; i < tetromino_names.length; i++){
                        squares[index].classList.remove(tetromino_names[i]);
                    }
                })

                const squaresRemoved = squares.splice(i, width);
                console.log(squaresRemoved);

                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over';
            clearInterval(timerId);
        }
    }
})
