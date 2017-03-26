import { Howl } from 'howler';
import BackgroundManager, { IStaticBackgroundOptions } from './collections/BackgroundManager';
import BulletManager from './collections/BulletManager';
import UnitManager, { IUnitOptions } from './collections/UnitManager';
import Renderer from './engine/Renderer';
import Scene from './engine/Scene';
import WholeViewCamera from './engine/WholeViewCamera';

interface IGameOptions {
    audioTheme: string;
    units: IUnitOptions[];
    backgrounds: IStaticBackgroundOptions[];
}

export default class Game {
    private renderer: Renderer;
    private theme: Howl;

    constructor(map: IGameOptions) {
        this.theme = new Howl({ src: map.audioTheme, loop: true, preload: true });

        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const unitManager = new UnitManager();
        const bulletManager = new BulletManager();

        for (const object of map.units) {
            unitManager.create(object);
        }

        unitManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));

        const backgroundManager = BackgroundManager.fromJSON(map.backgrounds);

        const scene = new Scene(
            backgroundManager,
            bulletManager,
            unitManager,
        );

        const camera = new WholeViewCamera();

        camera.track(unitManager);

        this.renderer = new Renderer({
            scene,
            ctx,
            camera,
        });
    }

    public play() {
        this.renderer.render();
        this.theme.play();
    }

    public pause() {
        this.renderer.stop();
        this.theme.pause();
    }
}