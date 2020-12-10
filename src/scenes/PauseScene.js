import BaseScene from './BaseScene';


class PauseScene extends BaseScene {

    constructor(config) {
        super('PauseScene', config);
        this.menu = [
            {
                scene: 'PlayScene',
                text: 'Continue'
            },
            {
                scene: 'MenuScene',
                text: 'Exit'
            }

        ]
    }

    create(){
        super.create();
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }

    setupMenuEvents(menuItem) {
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive();

        textGameObject.on('pointerover', ()=> {
            textGameObject.setStyle({fill: '#ff0'})
        })

        textGameObject.on('pointerout', ()=> {
            textGameObject.setStyle({fill: '#fff'})
        })

        textGameObject.on('pointerup', ()=> {
            if(menuItem.scene && menuItem.text === 'Continue'){
                //Continue resumes the scene (PlayScene) running in parallel via the launch function used to pause (PlayScene) 
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            } else {
                // Exit button stops both Play and Pause scenes & load Menu
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene);
            }
        })
    }
}
export default PauseScene;