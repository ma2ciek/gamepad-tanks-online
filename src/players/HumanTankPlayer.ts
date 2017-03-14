import IController from '../controllers/IController';
import ITankPlayer from './ITankPlayer';

export default class HumanTankPlayer implements ITankPlayer {
    private controller: IController;

    constructor(controller: IController) {
        this.controller = controller;
    }

    public isShooting() {
        return this.controller.isPressed(this.controller.key.SHOT_KEY);
    }

    public isSpeedButtonPressed() {
        return this.controller.isPressed(this.controller.key.SPEED_UP);
    }

    public getMoveVector() {
        return this.controller.getLeftAxis();
    }

    public getGunVector() {
        return this.controller.getRightAxis();
    }
}
