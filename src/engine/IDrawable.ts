import { ICameraOptions } from './ICamera';

interface IDrawable {
    draw( ctx: CanvasRenderingContext2D, options: ICameraOptions ): void;
}

export default IDrawable;
