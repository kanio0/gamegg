var GAME = {
    width: 600,
    height: 870,
    iflost: false,
    backgroundColor: "aqua",
}

var InfoWindow = {
    width: 200,
    height: GAME.height,
    x: GAME.width,
    backgroundColor: "red",
    textColor: "white",
    livex: 610,
    livey: 135,
}

var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

var maxSize = 50;
var maxSpeed = 20;
var minSpeed = 10;
var minSize = 35;

var METEOR = {
    x: Math.floor(Math.random() * (GAME.width - maxSize)),
    width: Math.floor(Math.random() * maxSize + minSize),
    y: -maxSize,
    size: Math.floor(Math.random() * maxSize + minSize),
    speedy: Math.floor(Math.random() * maxSpeed + minSpeed),
    color: "black",
}

var PLAYER = {
    x: 270,
    y: 783,
    width: 48,
    height: 21,
    color: "orangeRed",
    score: 0,
    lives: 3,
    xDirection: 10,

}

var ENEMY = {
    width: 222,
    height: 122,
}

var nlo = new Image(),
    background = new Image(),
    meteor = new Image(),
    hero = new Image(),
    live = new Image();

background.src = 'img/bg.png';
meteor.src = 'img/meteor.png';
hero.src = 'img/hero.png';
live.src = 'img/live.png';

nlo.src = 'img/nlo.png';
nlo.onload = function () {
    ENEMY.nlo = nlo;
}

background.onload = function () {
    GAME.background = background;
}

meteor.onload = function () {
    METEOR.meteor = meteor;
}

hero.onload = function () {
    PLAYER.hero = hero;
}

live.onload = function () {
    PLAYER.live = live;
}

function drawEnemy() {
    if (ENEMY.nlo) {
        canvasContext.drawImage(ENEMY.nlo, (GAME.width - ENEMY.width) / 2, 0, ENEMY.width, ENEMY.height);
    }

}

function drawMeteor() {
    if (METEOR.meteor) {
        canvasContext.drawImage(METEOR.meteor, METEOR.x, METEOR.y, METEOR.width, METEOR.width * 1.7);
    }

}

function drawBackground() {
    if (GAME.background) {
        canvasContext.drawImage(GAME.background, 0, 0);
    }

}

function drawInfo() {
    canvasContext.fillStyle = InfoWindow.backgroundColor;
    canvasContext.beginPath();
    canvasContext.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    canvasContext.fill();
    canvasContext.fillStyle = InfoWindow.textColor;
    canvasContext.font = "30px serif";
    canvasContext.fillText("Your score: ", InfoWindow.x + 10, 50)
    canvasContext.fillText(PLAYER.score, InfoWindow.x + 10, 85)
    canvasContext.fillText("Your lives: ", InfoWindow.x + 10, 120)
    canvasContext.fillText(PLAYER.lives, InfoWindow.x + 10, 155)
}

function drawPlayer() {
    if (PLAYER.hero) {
        canvasContext.drawImage(PLAYER.hero, PLAYER.x, PLAYER.y-90);
    }
}

function drawLives() {
    if (PLAYER.live) {
        for (let i = 0; i < PLAYER.lives; i++) {
            canvasContext.drawImage(PLAYER.live, InfoWindow.livex + i * 35, InfoWindow.livey + 30);
        }
    }
}


function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawMeteor();
    drawEnemy();
    drawInfo();
    drawLives();
}

function play() {
    if (GAME.iflost === false) {
        drawFrame();
        updateMeteor();
        requestAnimationFrame(play);
    }
    else {
        drawFrame();
        alert("You lose!");
    }
}

function respawnMeteor() {
    METEOR.size = Math.floor(Math.random() * maxSize + 15);
    METEOR.y = - METEOR.size;
    METEOR.width = Math.floor(Math.random() * maxSize + minSize);
    METEOR.x = Math.floor(Math.random() * (GAME.width - METEOR.width));

    METEOR.speedy = Math.floor(Math.random() * maxSpeed + 10);
}

function updateMeteor() {
    METEOR.y += METEOR.speedy;
    var losePositionY = METEOR.y + METEOR.size >= PLAYER.y
    var losePositionX = (METEOR.x - METEOR.size <= PLAYER.x + PLAYER.width) && (METEOR.x + METEOR.size >= PLAYER.x);
    var scoreUpdate = METEOR.y >= GAME.height + METEOR.size;
    if (scoreUpdate) {
        respawnMeteor();
        PLAYER.score++;
        console.log("score: " + PLAYER.score);
    }
    if (losePositionX && losePositionY) {
        respawnMeteor();
        PLAYER.lives -= 1;
        if (PLAYER.lives === 0) {
            GAME.iflost = true;

        }
        console.log("lives: " + PLAYER.lives);
    }
}

function invitEventListeners() {
    window.addEventListener("mousemove", onCanvasMouseMove);
    window.addEventListener("keydown", onCanvasKeyDown);

}

function onCanvasMouseMove(event) {
    if ((event.clientX + PLAYER.width < GAME.width) && (event.clientX - PLAYER.width / 2 > 0)) {
        PLAYER.x = event.clientX - PLAYER.width / 2;
    } else {
        if ((event.clientX + PLAYER.width > GAME.width)) {
            PLAYER.x = GAME.width - PLAYER.width;
        } else {
            PLAYER.x = 0;
        }
    }
}

function onCanvasKeyDown(event) {
    if (event.key === "ArrowLeft") {
        PLAYER.x = PLAYER.x - PLAYER.xDirection;
    }
    if (event.key === "ArrowRight") {
        PLAYER.x = PLAYER.x + PLAYER.xDirection;
    }
    if (PLAYER.x < 0) {
        PLAYER.x = 0;
    }
    if (PLAYER.x + PLAYER.width > GAME.width) {
        PLAYER.x = GAME.width - PLAYER.width;
    }
}

invitEventListeners();
play();
