const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 512;

//images
const birdImage = new Image();
birdImage.src = 'images/Bee.png';

const backgroundImage = new Image();
backgroundImage.src = 'images/background.png';

const foregroundImage = new Image();
foregroundImage.src = 'images/foreground.png';

const pipeDown = new Image();
pipeDown.src = 'images/pipeDown.png';

const pipeUp = new Image();
pipeUp.src = 'images/pipeUp.png';
//sounds
const fly = new Audio();
fly.src = 'sounds/fly.mp3';

const score = new Audio();
score.src = 'sounds/score.mp3';

//build bird
const bird = {
  x: 10,
  y: 150,
  frameWidth: 32,
  frameHeight: 32,
  frameCount: 2,
  currentFrame: 0
};
//functionality to bird
document.addEventListener('keydown', moveUp);

function moveUp() {
  bird.y -= 50;
  bird.currentFrame = (bird.currentFrame + 1) % bird.frameCount;
  //fly.play(); 
}

//background and foreground
const pipes = [];

pipes[0] = {
  x: canvas.width,
  y: 0
};

//function DRAW
let currentScore = 0;
let bgPattern = null;
let fgPattern = null;

backgroundImage.onload = function () {
  bgPattern = context.createPattern(backgroundImage, 'repeat-x');
  if (foregroundImage.complete) {
    fgPattern = context.createPattern(foregroundImage, 'repeat-x');
    draw();
  }
};

foregroundImage.onload = function () {
  fgPattern = context.createPattern(foregroundImage, 'repeat-x');
  // Only start draw if bgPattern already loaded
  if (backgroundImage.complete) {
    draw();
  }
};
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (bgPattern) {
    context.fillStyle = bgPattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.fillStyle = '#000';
  context.font = '20px Verdana';

  for (let index = 0; index < pipes.length; index++) {
    const pipe = pipes[index];
    const gap = 150;

    // Draw two images
    context.drawImage(pipeUp, pipe.x, pipe.y);
    context.drawImage(pipeDown, pipe.x, pipe.y + pipeUp.height + gap);

    // Move left
    pipe.x--;

    if (pipe.x == 125) {
      const newPipe = {
        x: canvas.width,
        y: Math.random() * pipeUp.height - pipeUp.height
      };

      newPipe.y = Math.floor(newPipe.y);
      pipes.push(newPipe);
    }

    //for replaying the game when lost and counting score
    const collision = bird.x + bird.frameWidth >= pipe.x &&
      bird.x <= pipe.x + pipeUp.width &&
      (bird.y <= pipe.y + pipeUp.height ||
        bird.y + bird.frameHeight >= pipe.y + pipeUp.height + gap) ||
      bird.y + bird.frameHeight >= canvas.height - foregroundImage.height;

    if (collision) {
      location.reload();
    }

    if (pipe.x == 5) {
      currentScore++;
      //score.play();
    }

    if (fgPattern) {
      context.save();
      context.fillStyle = fgPattern;

      context.translate(0, canvas.height - foregroundImage.height);
      context.fillRect(0, 0, canvas.width, foregroundImage.height);
      context.restore();
    }
    
  }

  const sx = bird.currentFrame * bird.frameWidth;
  context.drawImage(
    birdImage,
    sx, 0,
    bird.frameWidth, bird.frameHeight,
    bird.x, bird.y,
    bird.frameWidth, bird.frameHeight
  );

  const gravity = 0.5;
  bird.y += gravity;

  const scoreText = 'Score: ' + currentScore;
  context.fillText(scoreText, 10, canvas.height - 20);

  requestAnimationFrame(draw);

}

draw();
