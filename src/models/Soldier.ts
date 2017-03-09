import Emitter from '../utils/Emitter';
import Sprite from '../utils/Sprite';
import TimeController from '../utils/TimeController';
import Vector from '../utils/Vector';
import Bullet from './Bullet';
import IGameObject, { ICollidingGameObject } from './IGameObject';

interface ISprites {
    move: Sprite;
    idle: Sprite;
    distanceAttack: Sprite;
    meleeAtack: Sprite;
    reload: Sprite;
}

const URL = '../images/soldier/handgun/';

export default class Soldier implements IGameObject {
    public shotEmitter = new Emitter<Bullet>();
    public deathEmitter = new Emitter();

    public position: Vector;
    public radius = 30;
    public type = 'soldier';

    private hp = 100;
    private ammo = 6;
    private magazineSize = 6;
    private speed = 2;
    private bulletSpeed = 10;
    private angle = 0;
    private trackedObjects: Iterable<IGameObject>;
    private turningLeft = Math.random() < 0.5;
    private shotTimeController = new TimeController(1000);
    private bulletDamage = 10;
    private bulletRadius = 3;

    private handgunSprites: ISprites = {
        move: new Sprite({
            url: URL + 'move.png', frameDuration: 50,
            numberOfFrames: 20, zoom: 0.25,
        }),
        idle: new Sprite({
            url: URL + 'idle.png', frameDuration: 50,
            numberOfFrames: 20, zoom: 0.25,
        }),
        distanceAttack: new Sprite({
            url: URL + 'distanceAttack.png', frameDuration: 50,
            numberOfFrames: 3, zoom: 0.25, once: true,
        }),
        meleeAtack: new Sprite({
            url: URL + 'meleeAttack.png', frameDuration: 50,
            numberOfFrames: 10, zoom: 0.25,
        }),
        reload: new Sprite({
            url: URL + 'reload.png', frameDuration: 50,
            numberOfFrames: 15, zoom: 0.25, once: true,
        }),
    };

    private currentSprite = this.handgunSprites.idle;

    constructor(startPosition: Vector) {
        this.position = startPosition;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.currentSprite.draw(ctx, this.position, this.angle);
    }

    public track(iterable: Iterable<IGameObject>) {
        this.trackedObjects = iterable;
    }

    public handleHit(object: ICollidingGameObject) {
        if (object.type !== 'bullet' || object.owner === this) {
            return;
        }

        this.hp -= (object as any).damage;

        if (this.hp <= 0) {
            this.deathEmitter.emit({});
        }
    }

    public move() {
        const opponent = this.findBestOpponent();

        if (!opponent) {
            return;
        }

        const diffVector = Vector.fromDiff(this.position, opponent.position);
        const distance = Vector.getSize(diffVector);

        if (distance > 1000) {
            return;
        }

        // TODO: Improve this part.
        if (this.currentSprite.hasToFinish()) {
            return;
        }

        let moveVector: Vector;

        if (distance > 400) {
            moveVector = Vector.toSize(diffVector, Math.min(this.speed, distance));
            this.setSprite(this.handgunSprites.move);
        } else if (distance > 300) {
            if (this.hasToReload()) {
                this.reload();
                return;
            }

            if (this.shotTimeController.can()) {
                this.shot(opponent);
                return;
            }

            if (Math.random() < 0.02) {
                this.turningLeft = !this.turningLeft;
            }

            if (this.turningLeft) {
                moveVector = Vector.toSize({ x: -diffVector.y, y: diffVector.x }, this.speed / 2);
            } else {
                moveVector = Vector.toSize({ x: diffVector.y, y: -diffVector.x }, this.speed / 2);
            }

            this.setSprite(this.handgunSprites.idle);

        } else {
            moveVector = Vector.toSize({ x: -diffVector.x, y: -diffVector.y }, this.speed);
            this.setSprite(this.handgunSprites.move);
        }

        this.position = Vector.add(this.position, moveVector);
        this.angle = Vector.toAngle(diffVector) + Math.PI / 2;
    }

    private findBestOpponent() {
        const opponents = Array.from(this.trackedObjects);

        let bestOpponent = opponents[0];

        if (!bestOpponent) {
            return;
        }

        let bestDistance = Vector.squaredDistance(opponents[0].position, this.position);

        for (const opponent of opponents.slice(1)) {
            const distance = Vector.squaredDistance(opponent.position, this.position);
            if (distance < bestDistance) {
                bestOpponent = opponent;
                bestDistance = distance;
            }
        }

        return bestOpponent;
    }

    private hasToReload() {
        return this.ammo === 0;
    }

    private reload() {
        this.ammo = this.magazineSize;
        this.setSprite(this.handgunSprites.reload);
    }

    private shot(object: IGameObject) {
        this.setSprite(this.handgunSprites.distanceAttack);
        this.ammo--;

        const velocity = Vector.toSize(Vector.fromDiff(this.position, object.position), this.bulletSpeed);

        const translation = Vector.toSize(velocity, 40);
        const spriteShotModifier = Vector.add(translation, { x: -translation.y * 0.4, y: translation.x * 0.4 });
        const startPosition = Vector.add(this.position, spriteShotModifier);

        const bullet = new Bullet({
            position: startPosition,
            velocity,
            owner: this,
            damage: this.bulletDamage,
            radius: this.bulletRadius,
        });

        this.shotEmitter.emit(bullet);
    }

    private setSprite(sprite: Sprite) {
        if (this.currentSprite === sprite) {
            return;
        }

        this.currentSprite = sprite;
        this.currentSprite.reset();
    }
}
