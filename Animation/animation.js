// https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3
//code from above website integrated with a keydown listener to
//move the guy around the box


const scale = 2;
const width = 16;
const height = 18;
const scaledWidth = scale * width;
const scaledHeight = scale * height;
const cycleLoop = [0, 1, 0, 2];

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var currentLoopIndex = 0;
var frameCount = 60;
var moveCount = 0;
var spinCount = 0;
var guyX = 250 - scaledHeight/2;
var guyY = 150 - scaledWidth/2;

var img = new Image();
img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
img.onload = function () {
    init();
};

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}


function step() {
    frameCount++;
    if (frameCount < 15) {
        window.requestAnimationFrame(step);
        return;
    }
    frameCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(cycleLoop[currentLoopIndex], 0, guyX, guyY);
    currentLoopIndex++;
    if (currentLoopIndex >= cycleLoop.length) {
        currentLoopIndex = 0;
    }
    window.requestAnimationFrame(step);
}

function init() {
    window.requestAnimationFrame(step);
}

document.addEventListener("keydown", (event) => {
    var speed = 2;
    //console.log("key= " + event.key);
    if(event.shiftKey) speed = 8;
    if(event.ctrlKey) speed = 4;
    animate(event.key, speed);
})

function animate(k, speed) {
    if (k == "ArrowUp") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount = -115;
        guyY -= scaledHeight / speed;
        if (guyY < 0 - scaledHeight) guyY = 300 - scaledHeight / 2;
        drawFrame(cycleLoop[currentLoopIndex], 1, guyX, guyY);
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
        }
    }
    else if (k == "ArrowDown") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount = -115;
        guyY += scaledHeight / speed;
        if (guyY > 300) guyY = 0 - scaledHeight / 2;
        drawFrame(cycleLoop[currentLoopIndex], 0, guyX, guyY);
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
        }
    }
    else if (k == "ArrowLeft") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount = -115;
        guyX -= scaledWidth / speed;
        if (guyX < 0 - scaledWidth) guyX = 500 - scaledWidth / 2;
        drawFrame(cycleLoop[currentLoopIndex], 2, guyX, guyY);
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
        }
    }
    else if (k == "ArrowRight") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount = -115;
        guyX += scaledWidth / speed;
        if (guyX > 500) guyX = 0 - scaledWidth / 2;
        drawFrame(cycleLoop[currentLoopIndex], 3, guyX, guyY);
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
        }
    }
    else if (k == " ") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frameCount = -115;
        spinCount += 2;
        if (spinCount == 4) spinCount = 1;
        if (spinCount == 5) spinCount = 0;
        drawFrame(((spinCount % 2 == 0) ? 1 : 2), spinCount, guyX, guyY);
    }
}

    



