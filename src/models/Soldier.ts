import ISoldierPlayer from '../players/ISoldierPlayer';
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

export interface ISoldierOptions {
    position: Vector;
    type: 'soldier';
    player: ISoldierPlayer;
}

const URL = '../images/soldier/handgun/';

export default class Soldier implements IGameObject {
    public bulletEmitter = new Emitter<Bullet>();
    public deathEmitter = new Emitter();

    public position: Vector;
    public radius = 30;
    public type: 'soldier' = 'soldier';

    public handgunSprites: ISprites = {
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

    private player: ISoldierPlayer;

    // TODO: Make it configurable
    private hp = 100;
    private ammo = 6;
    private magazineSize = 6;
    private speed = 2;
    private bulletSpeed = 10;
    private angle = 0;
    private trackedObjects: Iterable<IGameObject>;
    private shotTimeController = new TimeController(1000);
    private bulletDamage = 10;
    private bulletRadius = 3;

    private currentSprite = this.handgunSprites.idle;

    constructor({ position, player }: ISoldierOptions) {
        this.position = position;
        this.player = player;
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

    public getShotTimeController() {
        return this.shotTimeController;
    }

    public move() {
        this.player.move(this);
    }

    // TODO: move to AI.
    public findBestOpponent() {
        const opponents = Array.from(this.trackedObjects).filter(obj => obj !== this);

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

    public hasToReload() {
        return this.ammo === 0;
    }

    public reload() {
        this.ammo = this.magazineSize;
        this.setSprite(this.handgunSprites.reload);
    }

    public shot(object: IGameObject) {
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

        this.bulletEmitter.emit(bullet);
    }

    public setSprite(sprite: Sprite) {
        if (this.currentSprite === sprite) {
            return;
        }

        this.currentSprite = sprite;
        this.currentSprite.reset();
    }

    public getSpeed() {
        return this.speed;
    }

    public getCurrentSprite() {
        return this.currentSprite;
    }

    public setAngle(angle: number) {
        this.angle = angle;
    }
}
