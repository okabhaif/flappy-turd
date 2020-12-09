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
let upperPipe = null;
let lowerPipe = null;
let pipeHorizontalDistance = 0;

const pipeGapDistanceRange = [150, 250];

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

  for(let i = 0; i < pipesToRender; i++){
    pipeHorizontalDistance += 400;
    let pipeVerticalDistance = Phaser.Math.Between(...pipeGapDistanceRange);
    let pipeVerticalPosition = Phaser.Math.Between(0+20, config.height - 20 - pipeVerticalDistance);

    upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalPosition, 'pipe').setOrigin(0, 1);
    lowerPipe = this.physics.add.sprite(upperPipe.x, upperPipe.y + pipeVerticalDistance , 'pipe').setOrigin(0);

    upperPipe.body.velocity.x = -200;
    lowerPipe.body.velocity.x = -200;
  }
  
  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

function update(time, delta){
  if (bird.y < 0 - bird.height || bird.y > config.height){
    restartBirdPosition();
  }
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
