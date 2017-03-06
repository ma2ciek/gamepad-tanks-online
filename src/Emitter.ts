type Callback<T> = (value: T) => void;

export default class Emitter<T> {
    private watchers: Array<Callback<T>> = [];

    public subscribe(fn: Callback<T>) {
        this.watchers.push(fn);
    }

    public emit(value: T) {
        this.watchers.forEach(fn => fn(value));
    }
}
