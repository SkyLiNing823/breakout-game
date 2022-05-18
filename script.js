const canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let HP = 3;

let bricks = [];
let COLORS = ["red", "orange", "yellow", "green", "blue"]; //顏色表
let totalScore = 0;
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []; //設置二維矩陣
    for (let r = 0; r < brickRowCount; r++) {
        level = Math.floor(Math.random() * 5) + 1; //隨機level
        totalScore += level; //紀錄獲勝所需總分
        bricks[c][r] = { x: 0, y: 0, levels: level }; //三個屬性
    }
}

document.addEventListener("mousemove", function(e) { //偵測滑鼠移動
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2; //改變paddle的X座標
    }
});



function collisionDetection() { //偵測ball撞brick
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.levels > 0) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; //dy設相反
                    b.levels -= 1;
                    score++;
                    if (score == totalScore) { //打完全部bricks
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload(); //重新整理頁面
                    }
                }
            }
        }
    }
}

function drawBall() { //繪製ball
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "purple";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() { //繪製paddle
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() { //繪製bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].levels > 0) {
                let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = COLORS[bricks[c][r].levels - 1]; //隨磚塊level設顏色
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() { //繪製score table
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawHP() { //繪製HP table
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("HP: " + HP, canvas.width - 80, 20);
}

function draw() { //繪製整個版面
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawHP();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) { //碰到左右牆
        dx = -dx;
    }
    if (y + dy < ballRadius) { //碰到天花板
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) { //碰到paddle高度
        if (x > paddleX && x < paddleX + paddleWidth + ballRadius) { //有被paddle接到
            dy = -dy;
        } else { //沒被paddle接到
            HP--;
            if (!HP) { //hp歸0
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx;
    y += dy;
}

setInterval("draw()", 10); //每10毫秒更新一次畫面