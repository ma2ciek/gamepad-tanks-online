import BulletManager from './BulletManager';
import PadController from './PadController';
import PlayerManager from './PlayerManager';
import Renderer from './Renderer';
import Scene from './Scene';
import SoldierManager from './SoldierManager';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const playerManager = new PlayerManager();
playerManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));

const bulletManager = new BulletManager();

const soldierManager = new SoldierManager();
soldierManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));
soldierManager.track(playerManager);
soldierManager.addSoldiers([
    { x: 200, y: 200 },
]);

const controller = new PadController(playerManager);

const scene = new Scene();
scene.add(
    playerManager,
    bulletManager,
    soldierManager,
);

playerManager.playerEmitter.subscribe(player => scene.centerAt(player));

const renderer = new Renderer({
    scene,
    controller,
    ctx,
});

renderer.render();
