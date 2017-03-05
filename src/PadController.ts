import ActionTree from './ActionTree';
import { padJoysticks, padKeys } from './ps4';
import { flash } from './utils';

interface IPadControllerSettings {
    sequenceMaxDelay: number;
}

const defaultSettings: IPadControllerSettings = {
    sequenceMaxDelay: 500,
};

export default class PadController {
    private settings: IPadControllerSettings;
    private actionTree = new ActionTree();
    private animationFrameId: number;
    private buttons = flash(this.gamePad.buttons);

    constructor(private gamePad: Gamepad, settings?: Partial<IPadControllerSettings>) {
        this.settings = { ...defaultSettings, ...settings };

        this.updateButtons();
    }

    public set(settings: Partial<IPadControllerSettings>) {
        this.settings = { ...this.settings, ...settings };
    }

    public onClick(button: number, action: () => void) {
        this.actionTree.add([button], action);
    }

    public onSequence(sequence: number[], action: () => void) {
        this.actionTree.add(sequence, action);
    }

    public disconnect() {
        this.removeKeyBinding();
    }

    private updateButtons() {
        const keys = Object.keys( padKeys ); // ??

        for (let i = 0; i < 18; i++) {
            if (this.gamePad.buttons[i].pressed && !this.buttons.data[i].pressed) {

                if (Date.now() - this.buttons.timeStamp > this.settings.sequenceMaxDelay) {
                    this.actionTree.reset();
                }

                this.actionTree.move(i);
            }
        }

        this.buttons = flash(this.gamePad.buttons);

        this.animationFrameId = window.requestAnimationFrame(() => this.updateButtons());
    }

    private removeKeyBinding() {
        window.cancelAnimationFrame(this.animationFrameId);
    }
}
