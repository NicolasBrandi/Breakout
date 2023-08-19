const grid = document.querySelector('.grid')
const score = document.getElementById('score')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 440
const boardHeigth = 300
const ballDiameter = 20
let timerID 
let xDirection = 2
let yDirection = 2
let scoreCount = 0


const ballStart = [217, 30]
let ballCurrentPosition = ballStart

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight] 
    }
    updatePosition(dx, dy) {
        this.bottomLeft[0] += dx;
        this.bottomLeft[1] += dy;
        this.bottomRight[0] += dx;
        this.bottomRight[1] += dy;
        this.topLeft[0] += dx;
        this.topLeft[1] += dy;
        this.topRight[0] += dx;
        this.topRight[1] += dy;
    }
}

// All blocks
let blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210)
]

// User block
let userBlock = new Block(175,10)

// addBlock -- add all blocks
function addBlock(){
    for (let i=0; i< blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add("block");
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomRight[1] + 'px';
        const blockId = `block-${i}`;
        block.setAttribute('id', blockId);
        grid.appendChild(block);
        blocks[i].id = blockId; // Store the ID in the Block instance
    }
}

addBlock()

// create user block
const uBlock = document.createElement('div')
uBlock.classList.add("userBlock")
setElementPosition(uBlock, userBlock.bottomLeft[0], userBlock.bottomLeft[1])
grid.appendChild(uBlock)

// create ball
const ball = document.createElement('div')
ball.classList.add("ball")
grid.appendChild(ball)
setElementPosition(ball, ballStart[0], ballStart[1])

//moveUser --
function moveUser(event){
    switch (event.key) {
        case 'ArrowLeft':
            if (userBlock.bottomLeft[0] > 5){
                userBlock.updatePosition(-10,0);
                setElementPosition(uBlock, userBlock.bottomLeft[0],userBlock.bottomLeft[1]);
            }
            break;
        case 'ArrowRight':
            if (userBlock.bottomRight[0] < (boardWidth)){
                userBlock.updatePosition(10,0);
                setElementPosition(uBlock, userBlock.bottomLeft[0], userBlock.bottomLeft[1]);
            }
            break;
        }
}

document.addEventListener('keydown', moveUser)

// moveBall --
function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    setElementPosition(ball, ballCurrentPosition[0], ballCurrentPosition[1])
    checkForCollisions()
}

// setInterval -- runs moveBall() every 30ms
timerID = setInterval(moveBall, 20)

// checkForCollisions -- 
function checkForCollisions() {
    // check for block collisions
    for(let i=0; i< blocks.length; i++) {
        if (topCollision(blocks[i]) || bottomCollision(blocks[i])){
            yDirection *= -1
            deleteBlockOnCollision(i)
            continue
        }
        if (leftCollision(blocks[i]) || rightCollision(blocks[i])){
            xDirection *= -1
        }
    }

    // check for user block collisions
    if (topCollision(userBlock)){
        yDirection *= -1
    }else if (rightCollision(userBlock) || leftCollision(userBlock)){
        console.log("in here")
        xDirection *= -1
    }

    // check for wall collisions
    if (ballCurrentPosition[1] >= (boardHeigth - ballDiameter -10)){
        yDirection *= -1
    }
    if(ballCurrentPosition[0] <= 0 || ballCurrentPosition[0] >= (boardWidth - ballDiameter)){
        xDirection *= -1
    }
    
    // check for game over
    if (ballCurrentPosition[1] <= 0 ){
        clearInterval(timerID)
        score.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveUser)
    }
}

// setElementPosition -- set element current positioning
function setElementPosition(element, xAxis, yAxis) {
    element.style.left = xAxis + 'px'
    element.style.bottom = yAxis + 'px'
}

// detectCollision --
function detectCollision(a) {
    return a.bottomLeft[0] < ballCurrentPosition[0] + ballDiameter &&
           a.bottomRight[0] > ballCurrentPosition[0] &&
           a.bottomLeft[1] < ballCurrentPosition[1] + ballDiameter &&
           a.topLeft[1] > ballCurrentPosition[1];
}

function topCollision(block){
    return detectCollision(block) && ballCurrentPosition[1] + ballDiameter >= block.topLeft[1];
}

function bottomCollision(block){
    return detectCollision(block) && (block.bottomLeft[1] + blockHeight) >= ballCurrentPosition[1]
}

function rightCollision(block){
    return detectCollision(block) && (block.bottomLeft[0] + blockWidth) >= (ballCurrentPosition[0] + ballDiameter)
}

function leftCollision(block){
    return detectCollision(block) && (ballCurrentPosition[0] + ballDiameter) >= block.bottomLeft[0]
}

// deleteBlockOnCollision --
function deleteBlockOnCollision(index) {
    const block = blocks[index];
    const blockElement = document.getElementById(block.id);
    if (blockElement) {
        blockElement.remove();
    }
    blocks.splice(index, 1);
}