import Vector from '@ma2ciek/math/src/Vector';

interface ICamera {
    updateBefore(ctx: CanvasRenderingContext2D): void;
    updateAfter(ctx: CanvasRenderingContext2D): void;
    getOptions(): ICameraOptions;
}

export interface ICameraOptions {
    center: Vector;
    width: number;
    height: number;
}

export default ICamera;
