import Bullet from './Bullet';

export default class BulletManager {
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
