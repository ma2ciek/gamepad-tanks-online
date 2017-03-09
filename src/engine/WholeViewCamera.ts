import IGameObjectCollection from '../collections/IGameObjectCollection';
import ICamera from './ICamera';

export default class WholeViewCamera implements ICamera {
    private collection: IGameObjectCollection;

    public updateBefore(ctx: CanvasRenderingContext2D) {
        const options = this.getOptions();

        const ratio = options.ratio;

        ctx.save();

        ctx.scale(ratio, ratio);

        ctx.translate(
            ctx.canvas.width / 2 / ratio - options.center.x,
            ctx.canvas.height / 2 / ratio - options.center.y,
        );
    }

    public updateAfter(ctx: CanvasRenderingContext2D) {
        ctx.restore();
    }

    public track(collection: IGameObjectCollection) {
        this.collection = collection;
    }

    public getOptions() {
        let maxLeft = Infinity;
        let maxRight = -Infinity;
        let maxTop = Infinity;
        let maxBottom = -Infinity;

        for (const { position } of this.collection) {
            maxLeft = Math.min(position.x, maxLeft);
            maxRight = Math.max(position.x, maxRight);
            maxTop = Math.min(position.y, maxTop);
            maxBottom = Math.max(position.y, maxBottom);
        }

        const ratio = Math.min(
            window.innerWidth / (maxRight - maxLeft + window.innerWidth),
            window.innerHeight / (maxBottom - maxTop + window.innerHeight),
        );

        return {
            center: {
                x: (maxLeft + maxRight) / 2,
                y: (maxTop + maxBottom) / 2,
            },
            width: window.innerWidth / ratio,
            height: window.innerHeight / ratio,
            ratio,
        };
    }
}
