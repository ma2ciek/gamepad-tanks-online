export function drawArc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawImage({
    ctx, image, x, y,
    width, height,
    canvasOffsetX, canvasOffsetY,
    angle = 0,
    center,
    zoom = 1,
}: IImageDrawingParams) {
    ctx.save();

    if (!center) {
        center = { x: 0, y: 0 };
    }

    ctx.translate(canvasOffsetX, canvasOffsetY);
    ctx.rotate(angle);

    ctx.drawImage(
        image,
        x, y, width, height,
        -width / 2 * zoom, -height / 2 * zoom, width * zoom, height * zoom,
    );

    ctx.restore();
}

interface IImageDrawingParams {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
    canvasOffsetX: number;
    canvasOffsetY: number;
    angle?: number;
    center?: {
        x: number;
        y: number;
    };
    zoom?: number;
}

export function loadImage(url: string) {
    return new Promise<HTMLImageElement>((res, rej) => {
        const image = new Image();
        image.onload = () => res(image);
        image.onerror = rej;
        image.onabort = rej;
        image.src = url;
    });
}

export function createArray<T>(size: number, filler: T) {
    const arr = new Array<T>(size);
    for (let i = 0; i < size; i++) {
        arr[i] = filler;
    }
    return arr;
}

interface ICanvasDrawingOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    strokeStyle?: string;
    strokeWidth?: number;
}

export function drawRect({ ctx, x, y, width, height, strokeStyle, strokeWidth }: ICanvasDrawingOptions) {
    if (strokeStyle && strokeWidth) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(x, y, width, height);
    }
}

export function normalizeAngle(angle: number) {
    angle = angle % (2 * Math.PI);

    if (angle > Math.PI) {
        angle -= 2 * Math.PI;
    }

    if (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }

    return angle;
}

export function joinCollections<T>(collection1: T): T;
export function joinCollections<T, P>(collection1: T, collection2: P): T & P;
export function joinCollections<T, P, R>(collection1: T, collection2: P, collection3: R): T & P & R;
export function joinCollections<T>(...collections: T[][]) {
    return {
        *[Symbol.iterator]() {
            for (const collection of collections) {
                for (const element of collection) {
                    yield element;
                }
            }
        },
    };
}

export function mod(x: number, y: number) {
    const result = x % y;

    return (result >= 0) ?
        result :
        result + y;
}
