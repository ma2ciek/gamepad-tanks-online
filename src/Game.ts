import BackgroundManager, { IStaticBackgroundOptions } from './collections/BackgroundManager';
import BulletManager from './collections/BulletManager';
import UnitManager, { IUnitOptions } from './collections/UnitManager';
import Cursor from './controllers/Cursor';
import Renderer from './engine/Renderer';
import Scene from './engine/Scene';
import WholeViewCamera from './engine/WholeViewCamera';

interface IGameOptions {
    audioTheme: string;
    units: IUnitOptions[];
    backgrounds: IStaticBackgroundOptions[];
    cursor: Cursor;
}

export default class Game {
    private renderer: Renderer;
    private canvas: HTMLCanvasElement;
    private cursor: Cursor;

    constructor( map: IGameOptions ) {
        this.cursor = map.cursor;
        this.canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;
        const ctx = this.canvas.getContext( '2d' ) as CanvasRenderingContext2D;

        const unitManager = new UnitManager();
        const bulletManager = new BulletManager();

        for ( const object of map.units ) {
            unitManager.create( object );
        }

        unitManager.bulletEmitter.subscribe( bullet => bulletManager.add( bullet ) );

        const backgroundManager = BackgroundManager.fromJSON( map.backgrounds );

        const scene = new Scene(
            backgroundManager,
            bulletManager,
            unitManager,
        );

        scene.addStaticElements( this.cursor );

        const camera = new WholeViewCamera();

        camera.track( unitManager );

        this.renderer = new Renderer( {
            scene,
            ctx,
            camera,
        } );
    }

    public play() {
        this.renderer.render();
        this.cursor.requestPointerLock( this.canvas );
    }

    public pause() {
        this.renderer.stop();
        this.cursor.exitPointerLock();
    }
}
