import IGameObject from '../models/IGameObject';
import IGameObjectCollection from './IGameObjectCollection';

export default class BackgroundManager implements IGameObjectCollection {
    public objectsCollide = false;
    private backgrounds: IGameObject[] = [];

    public [Symbol.iterator]() {
        return this.backgrounds[Symbol.iterator]();
    }

    public add(bg: IGameObject) {
        this.backgrounds.push(bg);
    }
}
