import BackgroundManager from './collections/BackgroundManager';
import BulletManager from './collections/BulletManager';
import PlayerManager from './collections/PlayerManager';
import SoldierManager from './collections/SoldierManager';
import PadController from './engine/PadController';
import Renderer from './engine/Renderer';
import Scene from './engine/Scene';
import WholeViewCamera from './engine/WholeViewCamera';
import ClassicBackground from './models/ClassicBackground';
import { joinIterators } from './utils/utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const playerManager = new PlayerManager();
playerManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));

const bulletManager = new BulletManager();

const soldierManager = new SoldierManager();
soldierManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));
soldierManager.track(playerManager);

window.setInterval(() => soldierManager.addSoldiers([{ x: 200, y: 200 }]), 10 * 1000);
soldierManager.addSoldiers([{ x: 200, y: 200 }]);

const backgroundManager = new BackgroundManager();
const classicBackground = new ClassicBackground(['#3a3', '#6a2']);

backgroundManager.add(classicBackground);

const controller = new PadController(playerManager);

const scene = new Scene(
    backgroundManager,
    bulletManager,
    playerManager,
    soldierManager,
);

const camera = new WholeViewCamera();

camera.track(joinIterators(playerManager, soldierManager));

const renderer = new Renderer({
    scene,
    controller,
    ctx,
    camera,
});

renderer.render();
