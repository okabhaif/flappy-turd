import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const width = 800;
const height = 600;
const startPosition = {x: width * 0.1, y: height / 2 };

const shared_config = {
  width,
  height,
  startPosition
}

const config = {
  type: Phaser.AUTO,
  ...shared_config,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: [new PlayScene(shared_config)]
}

new Phaser.Game(config);
