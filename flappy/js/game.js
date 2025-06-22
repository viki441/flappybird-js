const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 512;

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function loadSound(src) {
  const audio = new Audio(src);
  return audio;
}

const images = {
  background: loadImage('images/background.png'),
  foreground: loadImage('images/foreground.png'),
  pipeDown: loadImage('images/pipeDown.png'),
  pipeUp: loadImage('images/pipeUp.png')
};

const sounds = {
  fly: loadSound('sounds/fly.mp3'),
  score: loadSound('sounds/score.mp3')
};

let avatar = new Image();
avatar.src = "images/Eyeball1.png";

//build bird
const bird = {
  x: 10,
  y: 150,
  frameWidth: 64,
  frameHeight: 64,
  frameCount: 5,
  currentFrame: 0
};

let lastFlyTime = 0;
let lastFlapTime = 0;
const flyInterval = 150;
const flapInterval = 150;


//functionality to bird
document.addEventListener('keydown', moveUp);

function moveUp() {
  bird.y -= 50;
  //bird.currentFrame = (bird.currentFrame + 1) % bird.frameCount;
  //sounds.fly.play(); 
}

const pipes = [];

pipes[0] = {
  x: canvas.width,
  y: 0
};


let currentScore = 0;
let bgPattern = null;
let fgPattern = null;

images.background.onload = function () {
  bgPattern = context.createPattern(images.background, 'repeat-x');
  if (images.foreground.complete) {
    fgPattern = context.createPattern(images.foreground, 'repeat-x');
    draw();
  }
};

images.foreground.onload = function () {
  fgPattern = context.createPattern(images.foreground, 'repeat-x');
  // Only start draw if bgPattern already loaded
  if (images.background.complete) {
    draw();
  }
};





//for replaying the game when lost and counting score
function checkCollision(bird, pipe, images, canvas, gap) {
  const pipeTopHeight = images.pipeUp.height;
  const pipeBottomY = pipe.y + pipeTopHeight + gap;
  const foregroundY = canvas.height - images.foreground.height;

  const withinPipeX = bird.x + bird.frameWidth >= pipe.x && bird.x <= pipe.x + images.pipeUp.width;
  const hitsTopPipe = bird.y <= pipe.y + pipeTopHeight;
  const hitsBottomPipe = bird.y + bird.frameHeight >= pipeBottomY;
  const hitsGround = bird.y + bird.frameHeight >= foregroundY;

  return (withinPipeX && (hitsTopPipe || hitsBottomPipe)) || hitsGround;
}


const gravity = 0.5;

function draw(currentTime) {
  if (!lastFlyTime) lastFlyTime = currentTime;
  if (!lastFlapTime) lastFlapTime = currentTime;

  const elapsedFly = currentTime - lastFlyTime;
  const elapsedFlap = currentTime - lastFlapTime;

  if (elapsedFly >= flyInterval) {
    bird.y -= gravity;
    //sounds.fly.play();
    lastFlyTime = currentTime;
  }

  if (elapsedFlap >= flapInterval) {
    bird.currentFrame = (bird.currentFrame + 1) % bird.frameCount;
    lastFlapTime = currentTime;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (bgPattern) {
    context.fillStyle = bgPattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const gap = 150;

  for (let index = 0; index < pipes.length; index++) {
    const pipe = pipes[index];
    context.drawImage(images.pipeUp, pipe.x, pipe.y);
    context.drawImage(images.pipeDown, pipe.x, pipe.y + images.pipeUp.height + gap);
    pipe.x--;

    if (pipe.x === 125) {
      pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * images.pipeUp.height - images.pipeUp.height)
      });
    }

    if (checkCollision(bird, pipe, images, canvas, gap)) {
      location.reload();
    }

    if (pipe.x === 5) {
      currentScore++;
    }
  }

  if (fgPattern) {
    context.save();
    context.fillStyle = fgPattern;
    context.translate(0, canvas.height - images.foreground.height);
    context.fillRect(0, 0, canvas.width, images.foreground.height);
    context.restore();
  }

  const sx = bird.currentFrame * bird.frameWidth;
  context.drawImage(
    avatar,
    sx, 0,
    bird.frameWidth, bird.frameHeight,
    bird.x, bird.y,
    bird.frameWidth, bird.frameHeight
  );

  bird.y += gravity;

  context.fillStyle = '#000';
  context.font = '20px Verdana';
  context.fillText('Score: ' + currentScore, 10, canvas.height - 20);

  requestAnimationFrame(draw);
}


draw();