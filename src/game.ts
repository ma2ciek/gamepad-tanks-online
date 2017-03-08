import BackgroundManager from './collections/BackgroundManager';
import BulletManager from './collections/BulletManager';
import PlayerManager from './collections/PlayerManager';
import SoldierManager from './collections/SoldierManager';
import ClassicCamera from './engine/ClassicCamera';
import PadController from './engine/PadController';
import Renderer from './engine/Renderer';
import Scene from './engine/Scene';
import ClassicBackground from './models/ClassicBackground';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const playerManager = new PlayerManager();
playerManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));

const bulletManager = new BulletManager();

const soldierManager = new SoldierManager();
soldierManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));
soldierManager.track(playerManager);

window.setInterval(() => soldierManager.addSoldiers([{ x: 200, y: 200 }]), 10 * 1000);

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

const camera = new ClassicCamera();

camera.centerAt(playerManager);

const renderer = new Renderer({
    scene,
    controller,
    ctx,
    camera,
});

renderer.render();
