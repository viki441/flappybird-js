
const canvas =document.getElementById('canvas');
const context = canvas.getContext('2d');
//images
const birdImage = new Image();
birdImage.src = 'images/bird.png';

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
    x : 10,
    y : 150
};
//functionality to bird
document.addEventListener('keydown', moveUp);

function moveUp() {
    bird.y -= 25;
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
function draw(){
  context.drawImage(backgroundImage, 0, 0);

    context.fillStyle = '#000';
    context.font = '20px Verdana';
  
    for (let index = 0; index < pipes.length; index++) {
        const pipe = pipes[index];
        const gap = 85;
    
        // Draw two images
        context.drawImage(pipeUp, pipe.x, pipe.y);
        context.drawImage(pipeDown, pipe.x,pipe.y + pipeUp.height + gap);
    
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
        const collision = bird.x + birdImage.width >= pipe.x &&
  bird.x <= pipe.x + pipeUp.width &&
  (bird.y <= pipe.y + pipeUp.height ||
  bird.y + birdImage.height >= pipe.y + pipeUp.height + gap) ||
  bird.y + birdImage.height >= canvas.height - foregroundImage.height;

if (collision) {
  location.reload();
}
if (pipe.x == 5) {
  currentScore++;
  score.play();
}

      }

      
      context.drawImage(foregroundImage,0,
        canvas.height - foregroundImage.height);
    
        
      context.drawImage(birdImage,
        bird.x,
        bird.y);
    
        const gravity = 1.5;
        bird.y += gravity;
        

        const scoreText = 'Score: ' + currentScore;
  context.fillText(scoreText, 10, canvas.height - 20);

      
    requestAnimationFrame(draw);
    
}
draw();
//bird crash





