// --- Game Setup Constants ---
const board = document.querySelector('.board');
// Set a fixed board size to match CSS for simplicity. 300px / 50px = 6 blocks.
const blockheight = 50; 
const blockwidth = 50;
const boardWidth = 300; // Must match .board width in CSS
const boardHeight = 300; // Must match .board height in CSS

const cols = Math.floor(boardWidth / blockwidth); // Should be 6
const rows = Math.floor(boardHeight / blockheight); // Should be 6

// Set the board dimensions in JS to ensure calculations are correct (optional but safe)
board.style.width = `${boardWidth}px`;
board.style.height = `${boardHeight}px`;

// --- Game State Variables ---
let intervalId = null;
const blocks = {}; // Using an object for block elements keyed by "row-col"

// Initialize snake at a starting position
const snake = [{ x: 3, y: 3 }]; // Start roughly in the middle
let direction = 'right'; // Start moving right

// Function to generate a random food position
function generateFood() {
    let newFood;
    do {
        // x corresponds to row (0 to rows-1), y corresponds to col (0 to cols-1)
        newFood = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
    } while (isSnakeSegment(newFood)); // Ensure food doesn't spawn on the snake
    
    return newFood;
}

// Helper to check if a coordinate is part of the snake
function isSnakeSegment(coords) {
    return snake.some(segment => segment.x === coords.x && segment.y === coords.y);
}

let food = generateFood();


// --- Board Initialization (Grid Creation) ---
function initializeBoard() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.style.width = `${blockwidth}px`;
            block.style.height = `${blockheight}px`;
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }
}
initializeBoard(); // Call the function to build the grid


// --- Game Loop (The 'render' function is now 'moveAndRender') ---
function moveAndRender() {
    // 1. Calculate the new head position
    let head = { x: snake[0].x, y: snake[0].y }; // Start with current head position

    if (direction === 'left') {
        head.y -= 1;
    } else if (direction === 'right') {
        head.y += 1;
    } else if (direction === 'down') {
        head.x += 1;
    } else if (direction === 'up') {
        head.x -= 1;
    }

    // 2. Collision Detection
    // Check for wall collision
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        gameOver("Wall Collision!");
        return;
    }
    // Check for self-collision (eating itself)
    if (isSnakeSegment(head)) {
        gameOver("Self-Collision!");
        return;
    }

    // 3. Move the snake: Add the new head
    snake.unshift(head);
    
    // 4. Check for food
    const ateFood = head.x === food.x && head.y === food.y;

    if (ateFood) {
        // A. Remove food class from old position
        blocks[`${food.x}-${food.y}`].classList.remove('food');

        // B. Generate new food position
        food = generateFood(); 
        
        // *The snake grows automatically because we DON'T remove the tail.*
        
    } else {
        // If no food is eaten, remove the tail (to simulate movement)
        const tail = snake.pop();
        
        // Remove 'fill' class from the block where the tail was
        blocks[`${tail.x}-${tail.y}`].classList.remove('fill');
    }
    
    // 5. Update the visual state of the board
    // A. Add 'fill' class to the new head position
    blocks[`${head.x}-${head.y}`].classList.add('fill');

    // B. Add 'food' class to the new food position
    blocks[`${food.x}-${food.y}`].classList.add('food');

    // Note: The rest of the snake body already has the 'fill' class from previous calls.
}

// --- Game Control Functions ---

function startGame() {
    if (intervalId) return; // Prevent multiple intervals
    // Start the game loop (e.g., every 200ms)
    intervalId = setInterval(moveAndRender, 200); 
    console.log("Game Started!");
}

function gameOver(message) {
    clearInterval(intervalId);
    intervalId = null; // Reset the ID
    alert("Game Over! " + message);
    console.log("Game Over!");
}


// --- Event Listener for Controls ---
// Keep track of the last direction pressed to prevent reversing
let lastDirection = direction; 

addEventListener('keydown', event => {
    let newDirection = lastDirection;

    if (event.key === 'ArrowUp' && lastDirection !== 'down') {
        newDirection = 'up';
    } else if (event.key === 'ArrowDown' && lastDirection !== 'up') {
        newDirection = 'down';
    } else if (event.key === 'ArrowLeft' && lastDirection !== 'right') {
        newDirection = 'left';
    } else if (event.key === 'ArrowRight' && lastDirection !== 'left') {
        newDirection = 'right';
    }
    
    // Only update direction if it's a valid change
    if (newDirection !== lastDirection) {
        direction = newDirection;
        lastDirection = newDirection;
    }

    // Start the game on the first key press
    startGame();
});

// --- Initial Render to Show Snake and Food ---
function initialRender() {
    // Show the initial snake position
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
    // Show the initial food position
    blocks[`${food.x}-${food.y}`].classList.add("food");
}

initialRender();
console.log("Press any arrow key to start the game.");