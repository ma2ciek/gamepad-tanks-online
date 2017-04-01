import { Vector } from '@ma2ciek/math';
import IController from './IController';

const defaultKeyBinding = {
    SHOT_KEY: 5,
    SPEED_UP: 7,
};

export default class PadController implements IController {
    public get key() {
        return defaultKeyBinding;
    }

    private pad: Gamepad;

    public update(pad: Gamepad) {
        this.pad = pad;
    }

    public isPressed(button: number) {
        return this.pad.buttons[button].pressed;
    }

    public getLeftAxis() {
        return new Vector(this.pad.axes[0], this.pad.axes[1]);
    }

    public getRightAxis() {
        return new Vector(this.pad.axes[2], this.pad.axes[3]);
    }
}
