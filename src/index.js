import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';



const width = 800;
const height = 600;
const startPosition = {x: width * 0.1, y: height / 2 };

const shared_config = {
  width,
  height,
  startPosition
}

const scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = (scene) => new scene(shared_config);
const initScenes = () => scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...shared_config,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: initScenes(),
}

new Phaser.Game(config);
