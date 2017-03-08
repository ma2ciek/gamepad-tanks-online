export default class TimeController {
    private lastTimestamp = 0;
    private debounceTime = 0;

    constructor(debounceTime: number) {
        this.debounceTime = debounceTime;
    }

    public can() {
        const availible = Date.now() > this.debounceTime + this.lastTimestamp;
        if (availible) {
            this.lastTimestamp = Date.now();
        }

        return availible;
    }
}
