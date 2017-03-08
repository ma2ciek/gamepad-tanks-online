import IGameObjectIterable from '../collections/IGameObjectIterable';
import ICamera from './ICamera';

export default class ClassicCamera implements ICamera {
    private collection: IGameObjectIterable;

    public updateBefore(ctx: CanvasRenderingContext2D) {
        const options = this.getOptions();

        ctx.save();

        ctx.translate(
            -options.center.x + ctx.canvas.width / 2,
            -options.center.y + ctx.canvas.height / 2,
        );

        ctx.scale(
            ctx.canvas.width / (options.width + ctx.canvas.width),
            ctx.canvas.height / (options.height + ctx.canvas.height),
        );
    }

    public updateAfter(ctx: CanvasRenderingContext2D) {
        ctx.restore();
    }

    public centerAt(collection: IGameObjectIterable) {
        this.collection = collection;
    }

    public getOptions() {
        let maxLeft = 0;
        let maxRight = 0;
        let maxTop = 0;
        let maxBottom = 0;

        for (const { position } of this.collection) {
            maxLeft = Math.min(position.x, maxLeft);
            maxRight = Math.max(position.x, maxRight);
            maxTop = Math.min(position.y, maxTop);
            maxBottom = Math.max(position.y, maxBottom);
        }

        return {
            center: {
                x: (maxLeft + maxRight) / 2,
                y: (maxTop + maxBottom) / 2,
            },
            width: maxRight - maxLeft,
            height: maxBottom - maxTop,
        };
    }
}
