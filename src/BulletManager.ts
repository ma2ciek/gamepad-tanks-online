import Bullet from './Bullet';

export default class BulletManager {
    private bullets: Bullet[] = [];

    public getBullets() {
        return this.bullets;
    }

    public add(bullet: Bullet) {
        this.bullets.push(bullet);
    }
}
