import CollisionManager from './CollisionManager';
import IGameObject from './IGameObject';
import IGameObjectIterable, { ICollidingGameObjectIterable } from './IGameObjectIterable';
import Vector from './Vector';

export default class Scene {
    private collisionManager = new CollisionManager();
    private iterables: IGameObjectIterable[] = [];
    private centeredObject: { position: Vector } = { position: { x: 0, y: 0 } };

    public add(...iterables: IGameObjectIterable[]) {
        for (const iterable of iterables) {
            this.iterables.push(iterable);

            if (iterable.objectsCollide) {
                this.collisionManager.add(iterable as ICollidingGameObjectIterable);
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.translate(
            -this.centeredObject.position.x + ctx.canvas.width / 2,
            -this.centeredObject.position.y + ctx.canvas.height / 2,
        );

        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
                element.draw(ctx, { center: this.centeredObject.position });
            }
        }

        ctx.restore();
    }

    public move() {
        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
            }
        }

        this.collisionManager.checkCollisions();
    }

    public centerAt(object: IGameObject) {
        this.centeredObject = object;
    }
}
