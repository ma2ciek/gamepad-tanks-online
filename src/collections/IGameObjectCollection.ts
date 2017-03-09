import IGameObject, { ICollidingGameObject } from '../models/IGameObject';

interface IGameObjectCollection extends Iterable<IGameObject> {
    objectsCollide: boolean;
}

export interface ICollidingGameObjectCollection extends Iterable<ICollidingGameObject> {
    objectsCollide: boolean;
}

export default IGameObjectCollection;
