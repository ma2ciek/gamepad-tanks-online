import ICamera from './ICamera';
import Scene from './Scene';

interface IRendererOptions {
    scene: Scene;
    ctx: CanvasRenderingContext2D;
    camera: ICamera;
}

export default class Renderer {
    private scene: Scene;
    private ctx: CanvasRenderingContext2D;
    private camera: ICamera;
    private animatonId: number;

    constructor({ scene, ctx, camera }: IRendererOptions) {
        this.scene = scene;
        this.ctx = ctx;
        this.camera = camera;

        this.updateScreen();
        window.onresize = () => this.updateScreen();
    }

    public stop() {
        window.cancelAnimationFrame(this.animatonId);
    }

    public render = () => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.camera.updateBefore(this.ctx);

        this.scene.update();
        this.scene.render(this.ctx, this.camera.getOptions());

        this.camera.updateAfter(this.ctx);

        this.animatonId = window.requestAnimationFrame(this.render);
    }

    private updateScreen() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }
}
