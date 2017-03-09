import IGameObjectIterable, { ICollidingGameObjectCollection } from '../collections/IGameObjectCollection';
import CollisionManager from './CollisionManager';
import { ICameraOptions } from './ICamera';

export default class Scene {
    private collisionManager = new CollisionManager();
    private iterables: IGameObjectIterable[] = [];

    constructor(...iterables: IGameObjectIterable[]) {
        this.add(...iterables);
    }

    public add(...iterables: IGameObjectIterable[]) {
        for (const iterable of iterables) {
            this.iterables.push(iterable);

            if (iterable.objectsCollide) {
                this.collisionManager.add(iterable as ICollidingGameObjectCollection);
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D, cameraOptions: ICameraOptions) {
        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
                element.draw(ctx, cameraOptions);
            }
        }

        ctx.restore();
    }

    public update() {
        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
            }
        }

        this.collisionManager.checkCollisions();
    }
}
