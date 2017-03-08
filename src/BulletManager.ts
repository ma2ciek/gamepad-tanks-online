import Bullet from './Bullet';
import IGameObjectIterable from './IGameObjectIterable';

export default class BulletManager implements IGameObjectIterable {
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
