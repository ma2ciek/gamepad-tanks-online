import CollisionManager from './CollisionManager';
import IGameObject from './IGameObject';

export default class Scene {
    private collisionManager = new CollisionManager();
    private iterables: Array<Iterable<IGameObject>> = [];
    private centeredObject: IGameObject;

    public add(...iterables: Array<Iterable<IGameObject>>) {
        for (const iterable of iterables) {
            this.iterables.push(iterable);
        }

        this.collisionManager.add(...iterables);
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.translate(
            -this.centeredObject.position.x + ctx.canvas.width / 2,
            -this.centeredObject.position.y + ctx.canvas.height / 2
        );

        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
                element.draw(ctx);
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
