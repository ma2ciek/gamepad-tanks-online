import { drawImage, loadImage } from './utils';
import Vector from './Vector';

interface ISpriteOptions {
    url: string;
    frameDuration: number;
    numberOfFrames: number;
    zoom?: number;
    once?: boolean;
}

export default class Sprite {
    private currentFrameIndex: number;
    private frameWidth: number;
    private frameHeight: number;
    private image: HTMLImageElement;
    private frameDuration: number;
    private numberOfFrames: number;
    private lastTimestamp = 0;
    private zoom: number;
    private once: boolean;

    constructor(options: ISpriteOptions) {
        this.currentFrameIndex = 0;
        this.frameDuration = options.frameDuration;
        this.numberOfFrames = options.numberOfFrames;
        this.zoom = options.zoom || 1;
        this.once = !!options.once;

        loadImage(options.url).then(image => {
            this.image = image;
            this.frameWidth = image.naturalWidth / options.numberOfFrames;
            this.frameHeight = image.height;
        });
    }

    public reset() {
        this.currentFrameIndex = 0;
    }

    public hasToFinish() {
        return !this.isLastFrame() && this.once;
    }

    public isLastFrame() {
        return this.currentFrameIndex === this.numberOfFrames - 1;
    }

    public draw(ctx: CanvasRenderingContext2D, position: Vector, angle: number) {
        if (!this.image) {
            return;
        }

        if (Date.now() >= this.lastTimestamp + this.frameDuration) {
            this.nextFrame();
            this.lastTimestamp = Date.now();
        }

        drawImage({
            ctx,
            angle,
            width: this.frameWidth,
            height: this.frameHeight,
            canvasOffsetX: position.x,
            canvasOffsetY: position.y,
            image: this.image,
            x: this.frameWidth * this.currentFrameIndex,
            y: 0,
            zoom: this.zoom,
        });
    }

    private nextFrame() {
        if (!this.isLastFrame() || !this.once) {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.numberOfFrames;
        }
    }

}
