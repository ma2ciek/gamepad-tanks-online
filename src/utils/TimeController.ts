export default class TimeController {
    private lastTimestamp = 0;
    private debounceTime = 0;

    constructor( debounceTime: number ) {
        this.debounceTime = debounceTime;
    }

    public can() {
        const available = Date.now() > this.debounceTime + this.lastTimestamp;
        if ( available ) {
            this.lastTimestamp = Date.now();
        }

        return available;
    }
}
