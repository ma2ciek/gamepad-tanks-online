import IGameObject, { ICollidingGameObject } from './IGameObject';

interface IGameObjectIterable extends Iterable<IGameObject> {
    objectsCollide: boolean;
}

export interface ICollidingGameObjectIterable extends Iterable<ICollidingGameObject> {
    objectsCollide: boolean;
}

export default IGameObjectIterable;
