import PadController from './PadController';

interface IPadManagerSettings {
    automaticGamepadScanning: boolean;
}

const defaultPadManagerSettings: IPadManagerSettings = {
    automaticGamepadScanning: true,
};

export default class PadManager {
    private controllers: PadController[];
    private settings: IPadManagerSettings;

    constructor(settings?: Partial<IPadManagerSettings>) {
        this.controllers = [];
        this.settings = { ...defaultPadManagerSettings, ...settings };

        if (this.settings.automaticGamepadScanning) {
            window.setInterval(() => this.updateGamepads(), 500);
        }
    }

    public updateGamepads() {
        Array.from(navigator.getGamepads()).forEach((gamePad, index) => {
            if (gamePad && !this.controllers[index]) {
                this.controllers[index] = new PadController(gamePad);
            } else if (!gamePad && this.controllers[index]) {
                this.controllers[index].disconnect();
                this.controllers[index] = null;
            }
        });
    }

    public getController(index: number) {
        return this.controllers[index];
    }

    public getAvailableControllerIndices() {
        const indices: number[] = [];

        this.controllers.forEach((controller, index) => {
            if (controller) {
                indices.push(index);
            }
        });

        return indices;
    }
}
