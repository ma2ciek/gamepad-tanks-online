import IGameObject, { IDrawOptions } from './IGameObject';
import { mod } from './utils';

export default class ClassicBackground implements IGameObject {
    public position = { x: 0, y: 0 };
    public type = 'background';

    constructor(private colors: string[]) { }

    public draw(ctx: CanvasRenderingContext2D, { center }: IDrawOptions) {
        const tileSize = 100;

        const startX = Math.floor((center.x - ctx.canvas.width / 2) / tileSize) * tileSize;
        const startY = Math.floor((center.y - ctx.canvas.height / 2) / tileSize) * tileSize;

        for (let x = startX; x < center.x + ctx.canvas.width / 2; x += tileSize) {
            for (let y = startY; y < center.y + ctx.canvas.height / 2; y += tileSize) {
                // TODO: this.colors.length
                ctx.fillStyle = this.colors[mod(x + y, tileSize * 2) / tileSize];
                ctx.fillRect(x, y, tileSize + 1, tileSize + 1);
            }
        }
    }

    public move() { }
}
