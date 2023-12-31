//data game 

var gameInterval;
var startBtn = true;
var resetBtn = false;

//data canvas

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.status = 'ready';

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

//data ball

var ballRadius = 10;

//data paddle

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

//data keyboard

var rightPressed = false;
var leftPressed = false;

//data bricks

var brickRowCount = 1;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// data ratings

var score = localStorage.getItem('score') || 0;
var totalScore = localStorage.getItem('total_score') || 0;
var level = localStorage.getItem('level') || 0;

//Functions

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

if (ctx.status == 'ready') {
    gameInterval = setInterval(welcome);
}

//Keyboard functions

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {

    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

//Canvas drawings

/* function welcome() {
    if (ctx.status == 'ready') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        startBtn = true;
        resetBtn = false;
        ctx.font = "20px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Are you ready?", 170, 175);
    } else if (ctx.status == 'win') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        startBtn = true;
        resetBtn = false;
        ctx.font = "20px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("You win!! Next level in Start", 75, 175);
    } else if (ctx.status == 'completed') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "20px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Game completed! ;)", 100, 175);
    }
} */

function welcome() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtn = true;
    resetBtn = false;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Are you ready?", 170, 175);

}

function completed() {
    stopGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtn = false;
    resetBtn = true;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Game completed! ;)", 125, 175);
    resetBricks();
}



function youWin() {
    stopGame();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtn = true;
    resetBtn = false;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("You win!! Next level in Start", 75, 175);

}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}




function resetBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        updateRating();
                        resetScore();
                        if (level >= 2) {
                            ctx.status = 'completed';
                            completed();
                        } else {
                            ctx.status = 'win';
                            youWin();
                        }
                    }
                }
            }
        }
    }
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, 8, 20);
}

function resetGame() {
    if (resetBtn || ctx.status == 'pause') {
        level = 0;
        score = 0;
        totalScore = 0;
        localStorage.setItem('level', level);
        localStorage.setItem('score', score);
        localStorage.setItem('total_score', totalScore);
        document.location.reload();
    } else if (ctx.status == 'playing') {
        stopGame();
        ctx.status = 'pause';
    }
}

function stopGame() {
    clearInterval(gameInterval);
}

function nextLevel() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Game completed! ;)", 100, 175);

}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 80, 20);
}
function drawTotalScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Total Score: " + totalScore, 350, 20);
}

function resetScore() {
    score = 0;
    localStorage.setItem('score', score);
}

function updateRating() {
    level++;
    localStorage.setItem('level', level);
    totalScore = score * level;
    localStorage.setItem('total_score', totalScore);
    return level;
}

function startGame() {
    if (startBtn && ctx.status == 'win') {
        stopGame();
        resetBricks();
        ctx.status = 'playing';
        gameInterval = setInterval(draw, 10);
    } else if (startBtn && ctx.status != 'completed') {
        stopGame();
        ctx.status = 'playing';
        gameInterval = setInterval(draw, 10);
    }
}

function gameOver() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Game Over, reset and try again :)", 100, 175);
}


function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawTotalScore();
    drawLevel();
    collisionDetection();


    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;

        } else {
            ctx.status = 'game_over';
            startBtn = false;
            resetBtn = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            gameOver();
            return;
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}
