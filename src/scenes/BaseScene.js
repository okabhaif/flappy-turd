import Phaser from 'phaser';


class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key);
        this.config = config;
        this.fontSize = 34;
        this.lineHeight = 42;
        this.fontOptions ={fontSize: `${this.fontSize}px`, fill: '#fff'}
        this.screenCenter = [config.width / 2, config.height / 2 ]
    }

    create(){
        this.createBG();
        if (this.config.handleGoBack) {
            const backButton = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
            .setInteractive()
            .setScale(2)
            .setOrigin(1);
        

            backButton.on('pointerup', ()=>{
                this.scene.start('MenuScene');
            })
        }
    }
  
    createBG(){
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createMenu(menu, setupMenuEvents){
        let lastMenuPositionY = 0;
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0],this.screenCenter[1] + lastMenuPositionY,]; 
            menuItem.textGameObject = this.add.text(...menuPosition, menuItem.text,this.fontOptions ).setOrigin(0.5,1);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);
        })
    }
}
export default BaseScene;