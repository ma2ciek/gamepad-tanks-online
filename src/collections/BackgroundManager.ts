import IGameObject from '../models/IGameObject';
import IGameObjectIterable from './IGameObjectIterable';

export default class BackgroundManager implements IGameObjectIterable {
    public objectsCollide = false;
    private backgrounds: IGameObject[] = [];

    public [Symbol.iterator]() {
        return this.backgrounds[Symbol.iterator]();
    }

    public add(bg: IGameObject) {
        this.backgrounds.push(bg);
    }
}
