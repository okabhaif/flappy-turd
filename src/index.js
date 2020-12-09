import Phaser from 'phaser';

const config = {
  //WebGL (web graphics library) JS API for rendering 2D/3D graphics- part of almost every browser
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //arcade physics plugin manages physics of simulations e.g. gravity / velocity of simulations
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const velocity = 200;
const pipesToRender = 4;

let bird = null;
let pipes = null;

let pipeHorizontalDistance = 0;
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [450, 500];

const flapVelocity = 250;
const initialBirdPosition = {x: config.width * 0.1, y: config.height/2}

//loading assets e.g. images/music/animations etc..
function preload(){
  //'this' relates to the scene properties
  //contains / loads functions / properties to use 
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create(){
  this.add.image(0, 0, 'sky').setOrigin(0);
  //middle of height and around a tenth of width
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;

  pipes = this.physics.add.group()

  for(let i = 0; i < pipesToRender; i++){
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0 , 'pipe').setOrigin(0);

    placePipe(upperPipe, lowerPipe);
  }
  pipes.setVelocityX(-200);
  
  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

function update(time, delta){
  if (bird.y < 0 - bird.height || bird.y > config.height){
    restartBirdPosition();
  }
  recyclePipes();
}

function placePipe(upperPipe, lowerPipe) {
  const rightestX = getFurthestRightPipePosition();
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(0+20, config.height - 20 - pipeVerticalDistance);
  let pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
  upperPipe.x = rightestX + pipeHorizontalDistance;
  upperPipe.y = pipeVerticalPosition;
  lowerPipe.x = upperPipe.x;
  lowerPipe.y = upperPipe.y + pipeVerticalDistance;
}
function recyclePipes(){
  const newPipes = [];
  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0) {
      //recycle the pipe when it hits 0 e.g. the pipe moves out of view 
      newPipes.push(pipe);
      if(newPipes.length === 2){
        placePipe(...newPipes);
      }
    }
  })
}

function getFurthestRightPipePosition(){
  let rightestX = 0;

  pipes.getChildren().forEach(function(pipe) {
    rightestX = Math.max(pipe.x, rightestX)
  })
  return rightestX;
}
function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0; //stops it from compounding and getting too fast when bird/player is reset
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}

new Phaser.Game(config);
