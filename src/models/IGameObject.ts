import Vector from '../utils/Vector';

export interface IGameObject {
    position: Vector;
    type: string;

    draw(ctx: CanvasRenderingContext2D, options: IDrawOptions): void;
    move(): void;
}

export interface ICollidingGameObject extends IGameObject {
    radius: number;
    owner?: ICollidingGameObject;

    handleHit(object: IGameObject): void;
}

export interface IDrawOptions {
    center: Vector;
}

export default IGameObject;
