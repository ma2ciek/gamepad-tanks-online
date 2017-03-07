export default class PadController {
    // TODO.

    constructor(private updater: { updatePads: () => void }) {
    }

    public update() {
        this.updater.updatePads();
    }
}
