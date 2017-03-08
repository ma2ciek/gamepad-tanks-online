import Bullet from './Bullet';
import Emitter from './Emitter';
import IGameObject, { ICollidingGameObject } from './IGameObject';
import Sprite from './Sprite';
import TimeController from './TimeController';
import Vector from './Vector';

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
    private MAGAZINE_SIZE = 6;
    private speed = 2;
    private angle = 0;
    private trackedObjects: Iterable<IGameObject>;
    private turningLeft = Math.random() < 0.5;
    private shotTimeController = new TimeController(1000);

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

        this.hp -= 10;

        if (this.hp <= 0) {
            this.deathEmitter.emit({});
        }
    }

    public move() {
        // TODO: track best object, not first
        const object = Array.from(this.trackedObjects)[0];

        if (!object) {
            return;
        }

        const diffVector = Vector.fromDiff(this.position, object.position);
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
                this.shot(object);
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

    private hasToReload() {
        return this.ammo === 0;
    }

    private reload() {
        this.ammo = this.MAGAZINE_SIZE;
        this.setSprite(this.handgunSprites.reload);
    }

    private shot(object: IGameObject) {
        this.setSprite(this.handgunSprites.distanceAttack);
        this.ammo--;

        const velocity = Vector.toSize(Vector.fromDiff(this.position, object.position), 5);

        const translation = Vector.toSize(velocity, 40);
        const spriteShotModifier = Vector.add(translation, { x: -translation.y * 0.4, y: translation.x * 0.4 });
        const startPosition = Vector.add(this.position, spriteShotModifier);

        const bullet = new Bullet(startPosition, velocity, this);

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
