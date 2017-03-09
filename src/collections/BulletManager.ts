import Bullet from '../models/Bullet';
import IGameObjectCollection from './IGameObjectCollection';

export default class BulletManager implements IGameObjectCollection {
    public objectsCollide = true;
    private bullets: Bullet[] = [];

    public [Symbol.iterator]() {
        return this.bullets[Symbol.iterator]();
    }

    public add(bullet: Bullet) {
        this.bullets.push(bullet);

        bullet.destroyEmitter.subscribe(() => {
            this.bullets = this.bullets.filter(b => b !== bullet);
        });
    }
}
