import Vector from './Vector';

interface IGameObject {
    position: Vector;
    radius: number;
    type: string;
    owner?: IGameObject;

    handleHit(object: IGameObject): void;
    draw(ctx: CanvasRenderingContext2D): void;
    move(): void;
}

export default IGameObject;
