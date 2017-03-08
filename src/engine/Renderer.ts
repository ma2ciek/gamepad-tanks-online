import ICamera from './ICamera';
import IController from './IController';
import Scene from './Scene';

interface IRendererOptions {
    scene: Scene;
    controller: IController;
    ctx: CanvasRenderingContext2D;
    camera: ICamera;
}

export default class Renderer {
    private scene: Scene;
    private controller: IController;
    private ctx: CanvasRenderingContext2D;
    private camera: ICamera;

    constructor({ scene, controller, ctx, camera }: IRendererOptions) {
        this.scene = scene;
        this.controller = controller;
        this.ctx = ctx;
        this.camera = camera;

        this.updateScreen();
        window.onresize = () => this.updateScreen();
    }

    public render = () => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.camera.updateBefore(this.ctx);

        this.controller.update();
        this.scene.update();
        this.scene.render(this.ctx, this.camera.getOptions());

        this.camera.updateAfter(this.ctx);

        requestAnimationFrame(this.render);
    }

    private updateScreen() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }
}
