const grid = document.querySelector('.grid')
const score = document.getElementById('score')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 440
const boardHeigth = 300
const ballDiameter = 10
let timerID 
let xDirection = 2
let yDirection = 2
let scoreCount = 0

const userStart = [175, 10]
let currentPosition = userStart

const ballStart = [217, 30]
let ballCurrentPosition = ballStart

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight] 
    }
}

// All blocks
const blocks = [
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

// addBlock -- add all blocks
function addBlock(){
    for (let i=0; i< blocks.length; i++) {
        const block = document.createElement('div')
        block.classList.add("block")
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomRight[1] + 'px'
        grid.appendChild(block)
    }
}

addBlock()

// create user block
const userBlock = document.createElement('div')
userBlock.classList.add("userBlock")
setElementPosition(userBlock, currentPosition[0], currentPosition[1])
grid.appendChild(userBlock)

// create ball
const ball = document.createElement('div')
ball.classList.add("ball")
grid.appendChild(ball)
setElementPosition(ball, ballStart[0], ballStart[1])

//moveUser --
function moveUser(event){
    switch (event.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 5){
                currentPosition[0] -= 10
                setElementPosition(userBlock, currentPosition[0], currentPosition[1])
            }
            break
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth){
                currentPosition[0] += 10
                setElementPosition(userBlock, currentPosition[0], currentPosition[1])
            }
            break
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
timerID = setInterval(moveBall, 30)

// checkForCollisions -- 
function checkForCollisions() {
    // check for block collisions
    // for(let i=0; i< blocks.length; i++) {
    //     if (
    //         (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
    //         ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
    //         ) {
    //             const allBlocks = Array.from(document.querySelectorAll('.block'))
    //             allBlocks[i].classList.remove('block')
    //             blocks.splice(i, 1)
    //             changeBallDirection()
    //             scoreCount++
    //             score.innerHTML = scoreCount
    //         }
    // }
   
    // check for user collisions
    if(
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < (currentPosition[0] + blockWidth)) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < (currentPosition[1] + blockHeight))
    ) {
        changeBallDirection()
    }

    // check for wall collisions
    if (
    ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
    ballCurrentPosition[1] >= (boardHeigth - ballDiameter -10) ||
    ballCurrentPosition[0] <= 0
    )
    {
        changeBallDirection()
        console.log(xDirection, yDirection)
    }
    
    // check for game over
    if (ballCurrentPosition[1] <= 0 ){
        clearInterval(timerID)
        score.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveUser)
    }
}

// changeBallDirection -- change direction on collision
function changeBallDirection(){
    if (xDirection === 2 && yDirection === 2){
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2){
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2){
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2){
        xDirection = 2
        return
    }
}

// setElementPosition -- set element current positioning
function setElementPosition(element, xAxis, yAxis) {
    element.style.left = xAxis + 'px'
    element.style.bottom = yAxis + 'px'
}