import Emitter from '../utils/Emitter';
import IController from './IController';
import MouseAndKeyboardController from './MouseAndKeyboardController';
import PadController from './PadController';

export default class ControllerManager {
    public newControllerEmitter = new Emitter<IController>();
    private padControllers: { [id: string]: PadController } = {};
    private mouseAndKeyboardController = new MouseAndKeyboardController();

    constructor() {
        setTimeout(() => {
            this.update();
            this.newControllerEmitter.emit(this.mouseAndKeyboardController);
        });
    }

    public getControllers(): IController[] {
        return [
            this.mouseAndKeyboardController,
            ...Object.keys(this.padControllers).map(id => this.padControllers[id]),
        ].filter(c => !!c);
    }

    public update = () => {
        this.updatePads();
        requestAnimationFrame(this.update);
    }

    private updatePads() {
        const pads = navigator.getGamepads();

        Array.from(pads).forEach((pad, index) => {
            if (!pad) {
                return;
            }

            if (!this.padControllers[pad.id]) {
                this.addPad(pad);
                this.padControllers[pad.id].update(pad);
                this.newControllerEmitter.emit(this.padControllers[pad.id]);
            } else {
                this.padControllers[pad.id].update(pad);
            }
        });
    }

    private addPad(pad: Gamepad) {
        this.padControllers[pad.id] = new PadController();
    }
}
