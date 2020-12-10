import BaseScene from './BaseScene';

const pipesToRender = 4;

class PlayScene extends BaseScene {
    
    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.isPaused = false;

        this.pipes = null;
        this.pipeHorizontalDistance = 0;

        this.flapVelocity = 300;
        this.score = 0;
        this.scoreText = '';
        
        this.currentDifficulty = 'easy';
        this.difficulties = {
          'easy': {
            pipeHorizontalDistanceRange : [300, 350],
            pipeVerticalDistanceRange : [150, 200]
          },
          'normal': {
            pipeHorizontalDistanceRange : [280, 330],
            pipeVerticalDistanceRange : [140, 190]
          },
          'hard': {
            pipeHorizontalDistanceRange : [250, 310],
            pipeVerticalDistanceRange : [120, 170]
          },
          'insane': {
            pipeHorizontalDistanceRange : [240, 310],
            pipeVerticalDistanceRange : [100, 150]
          }
        }
    }

    create(){
        this.currentDifficulty = 'easy';
        super.create();
        this.createBird();
        this.createPipes();
        this.createCollision();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.listenToEvents();

        this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('bird', {start: 8, end: 15}),
          frameRate: 8, //plays 8 frames p sec
          repeat: -1, //repeat infinite times
  
        })
        this.bird.play('fly');
    }

    update(){
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
        .setScale(3)
        .setFlipX(true)
        .setOrigin(0);

        this.bird.setBodySize(this.bird.width, this.bird.height - 10);
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
        const bestScore = localStorage.getItem('bestScore');

        this.scoreText = this.add.text(16,16, `Score: ${0}`, {fontSize: '32px', fill: '#555' });
        this.add.text(16,52, `Best score: ${bestScore || 0}`, {fontSize: '18px', fill: '#555' });

    }

    createPause(){
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
        .setInteractive()
        .setScale(2)
        .setOrigin(1);

        pauseButton.on('pointerdown', ()=>{
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene'); //launch keeps game mechanics in place whilst displaying a diff screen in parallel
        })
    }
    handleInputs(){
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    countdown(){
      this.initialTime--;
      this.countdownText.setText('Fly in: ' + this.initialTime);

      if(this.initialTime <= 0) {
        this.isPaused = false;
        this.countdownText.setText('');
        this.physics.resume();
        this.timedEvent.remove();
      }
    }

    listenToEvents(){
      if(this.pauseEvent) { return; }

      this.pauseEvent = this.events.on('resume', () => {
        this.initialTime  = 3;
        this.countdownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions)
        .setOrigin(0.5);
        this.timedEvent = this.time.addEvent({
          delay: 1000,
          callback: this.countdown,
          callbackScope: this,
          loop: true
        })
      })
    }

    checkGameStatus(){
        if (this.bird.y <= 0 - this.bird.height || this.bird.getBounds().bottom >= this.config.height){
            this.gameOver();
        }
    }

    placePipe(upperPipe, lowerPipe) {
      const difficulty = this.difficulties[this.currentDifficulty]
        const rightestX = this.getFurthestRightPipePosition();
        let pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        let pipeVerticalPosition = Phaser.Math.Between(0+20, this.config.height - 20 - pipeVerticalDistance);
        let pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
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
              this.saveBestScore();
              this.increaseDifficulty();
            }
          }
        })
      }

      increaseDifficulty(){
        if(this.score === 10){
          this.currentDifficulty = 'normal'
        }
        if(this.score === 20){
          this.currentDifficulty = 'hard'
        }
        
      }

      getFurthestRightPipePosition(){
        let rightestX = 0;
        this.pipes.getChildren().forEach(function(pipe) {
          rightestX = Math.max(pipe.x, rightestX)
        })
        return rightestX;
      }

      saveBestScore(){
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10); 
        
        if(!bestScore || this.score > bestScore ) {
          localStorage.setItem('bestScore', this.score);
        }
      }

      gameOver() {
          this.physics.pause();
          this.bird.setTint(0xEE4824);       

          this.saveBestScore(); 

          this.time.addEvent({
              delay: 1000,
              callback: () => {
                this.scene.restart();
              },
              loop: false
          })
      }
      
      flap(){
        if(this.isPaused) { return; }

        this.bird.body.velocity.y = -this.flapVelocity
      }

      increaseScore(){
          this.score++;
          this.scoreText.setText(`Score: ${this.score}`);
      }
}

export default PlayScene;