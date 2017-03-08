import Vector from '../utils/Vector';

interface ICamera {
    updateBefore(ctx: CanvasRenderingContext2D): void;
    updateAfter(ctx: CanvasRenderingContext2D): void;
    getOptions(): ICameraOptions;
}

export interface ICameraOptions {
    center: Vector;
}

export default ICamera;
