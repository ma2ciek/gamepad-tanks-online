import Emitter from './Emitter';
import IGameObject from './IGameObject';
import { drawArc } from './utils';
import Vector from './Vector';

export default class Bullet implements IGameObject {
    public destroyEmitter = new Emitter();
    public radius = 3;
    public type = 'bullet';

    public constructor(
        public position: Vector,
        public velocity: Vector,
        public owner: IGameObject,
    ) { }

    public draw(ctx: CanvasRenderingContext2D) {
        drawArc(ctx, this.position.x, this.position.y, this.radius, 'black');
    }

    public move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    public handleHit() {
        this.destroyEmitter.emit(this);
    }
}
