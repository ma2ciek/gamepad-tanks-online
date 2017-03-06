import Player from './Player';
import { drawArc } from './utils';
import Vector from './Vector';

export default class Bullet {
    public radius = 3;

    public constructor(
        public position: Vector,
        public velocity: Vector,
        public owner: Player,
    ) { }

    public draw(ctx: CanvasRenderingContext2D) {
        drawArc(ctx, this.position.x, this.position.y, this.radius, 'black');
    }

    public move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
