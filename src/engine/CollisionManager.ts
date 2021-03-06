import { Vector } from '@ma2ciek/math';
import { ICollidingGameObjectCollection } from '../collections/IGameObjectCollection';
import { ICollidingGameObject } from '../models/IGameObject';

export default class CollisionManager {
    private objectIterators: ICollidingGameObjectCollection[] = [];

    public add(...objects: ICollidingGameObjectCollection[]) {
        this.objectIterators.push(...objects);
    }

    public checkCollisions() {
        for (let i = 0; i < this.objectIterators.length; i++) {
            for (let j = 0; j < i; j++) {
                for (const o1 of this.objectIterators[i]) {
                    for (const o2 of this.objectIterators[j]) {
                        const collision = this.checkCollision(o1, o2);

                        if (collision) {
                            o1.handleHit(o2);
                            o2.handleHit(o1);
                        }
                    }
                }
            }
        }
    }

    private checkCollision(o1: ICollidingGameObject, o2: ICollidingGameObject) {
        return (o1.radius + o2.radius) ** 2 > Vector.squaredDistance(o1.position, o2.position);
    }
}
