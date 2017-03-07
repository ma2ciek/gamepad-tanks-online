import IController from './IController';
import Scene from './Scene';

export default class Renderer {
    private scene: Scene;
    private controller: IController;
    private ctx: CanvasRenderingContext2D;

    constructor({ scene, controller, ctx }: {
        scene: Scene,
        controller: IController,
        ctx: CanvasRenderingContext2D,
    }) {
        this.scene = scene;
        this.controller = controller;
        this.ctx = ctx;

        this.updateScreen();
        window.onresize = () => this.updateScreen();
    }

    public render = () => {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.controller.update();
        this.scene.move();
        this.scene.render(this.ctx);

        requestAnimationFrame(this.render);
    }

    private updateScreen() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }
}
