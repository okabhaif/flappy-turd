import Phaser from 'phaser';

const pipesToRender = 4;

class PlayScene extends Phaser.Scene {
    
    constructor(config) {
        super('PlayScene');
        this.config = config;
        this.bird = null;
        this.pipes = null;
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [450, 500];
        this.flapVelocity = 300;

        this.score = 0;
        this.scoreText = '';
    }

    preload(){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create(){
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createCollision();
        this.createScore();
        this.handleInputs();

    }

    update(){
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBG(){
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true); //bird collides with top and bottom

    }

    createPipes(){
        this.pipes = this.physics.add.group()

        for(let i = 0; i < pipesToRender; i++){
          const upperPipe = this.pipes.create(0, 0, 'pipe')
          .setImmovable(true)
          .setOrigin(0, 1);
          const lowerPipe = this.pipes.create(0, 0 , 'pipe')
          .setImmovable(true)
          .setOrigin(0);
      
          this.placePipe(upperPipe, lowerPipe);
        }
        this.pipes.setVelocityX(-200);
    }

    createCollision(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore(){
        this.score = 0;
        this.scoreText = this.add.text(16,16, `Score: ${0}`, {fontSize: '32px', fill: '#555' })
    }

    handleInputs(){
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGameStatus(){
        if (this.bird.y <= 0 - this.bird.height || this.bird.getBounds().bottom >= this.config.height){
            this.gameOver();
        }
    }

    placePipe(upperPipe, lowerPipe) {
        const rightestX = this.getFurthestRightPipePosition();
        let pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        let pipeVerticalPosition = Phaser.Math.Between(0+20, this.config.height - 20 - pipeVerticalDistance);
        let pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
        upperPipe.x = rightestX + pipeHorizontalDistance;
        upperPipe.y = pipeVerticalPosition;
        lowerPipe.x = upperPipe.x;
        lowerPipe.y = upperPipe.y + pipeVerticalDistance;
      }

      recyclePipes(){
        const newPipes = [];
        this.pipes.getChildren().forEach(pipe => {
          if(pipe.getBounds().right <= 0) {
            //recycle the pipe when it hits 0 e.g. the pipe moves out of view 
            newPipes.push(pipe);
            if(newPipes.length === 2){
              this.placePipe(...newPipes);
              this.increaseScore();
            }
          }
        })
      }

      getFurthestRightPipePosition(){
        let rightestX = 0;
        this.pipes.getChildren().forEach(function(pipe) {
          rightestX = Math.max(pipe.x, rightestX)
        })
        return rightestX;
      }

      gameOver() {
          this.physics.pause();
          this.bird.setTint(0xEE4824); //colour feedback that player has crashed! 

          this.time.addEvent({
              delay: 1000,
              callback: () => {
                this.scene.restart();
              },
              loop: false
          })
      }
      
      flap(){
        this.bird.body.velocity.y = -this.flapVelocity
      }

      increaseScore(){
          this.score++;
          this.scoreText.setText(`Score: ${this.score}`);
      }
}

export default PlayScene;