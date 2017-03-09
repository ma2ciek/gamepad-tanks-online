import { ICameraOptions } from '../engine/ICamera';
import IGameObject from '../models/IGameObject';
import Emitter from '../utils/Emitter';
import { drawArc } from '../utils/utils';
import Vector from '../utils/Vector';

interface IBulletOptions {
    position: Vector;
    velocity: Vector;
    owner: IGameObject;
    damage: number;
    radius: number;
}

export default class Bullet implements IGameObject {
    public destroyEmitter = new Emitter();
    public type = 'bullet';

    public get position() {
        return this.options.position;
    }

    public get radius() {
        return this.options.radius;
    }

    public get damage() {
        return this.options.damage;
    }

    public constructor(private options: IBulletOptions) { }

    public draw(ctx: CanvasRenderingContext2D, options: ICameraOptions) {
        if (
            this.position.x < options.center.x - options.width / 2 ||
            this.position.x > options.center.x + options.width / 2 ||

            this.position.y < options.center.y - options.height / 2 ||
            this.position.y > options.center.y + options.height / 2
        ) {
            this.handleHit();
            return;
        }

        drawArc(ctx, this.position.x, this.position.y, this.radius, 'black');
    }

    public move() {
        this.position.x += this.options.velocity.x;
        this.position.y += this.options.velocity.y;
    }

    public handleHit() {
        this.destroyEmitter.emit(this);
    }
}
