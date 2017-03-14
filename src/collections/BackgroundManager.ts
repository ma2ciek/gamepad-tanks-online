import ClassicBackground from '../models/ClassicBackground';
import IGameObject from '../models/IGameObject';
import IGameObjectCollection from './IGameObjectCollection';

export interface IStaticBackgroundOptions {
    colors: string[];
}

export default class BackgroundManager implements IGameObjectCollection {
    public static fromJSON(backgrounds: IStaticBackgroundOptions[]) {
        const backgroundManager = new BackgroundManager();

        // TODO
        for (const background of backgrounds) {
            backgroundManager.add(
                new ClassicBackground(background.colors),
            );
        }

        return backgroundManager;
    }

    public objectsCollide = false;
    private backgrounds: IGameObject[] = [];

    public [Symbol.iterator]() {
        return this.backgrounds[Symbol.iterator]();
    }

    public add(bg: IGameObject) {
        this.backgrounds.push(bg);
    }
}
