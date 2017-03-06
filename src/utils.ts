export function drawArc(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawImage({
    ctx, image, x, y, width, height, canvasOffsetX, canvasOffsetY, angle = 0,
    center,
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
        -width / 2, -height / 2, width, height,
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

export function createArray(size: number, filler: any) {
    const arr = new Array(size);
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
