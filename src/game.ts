import BulletManager from './BulletManager';
import PlayerManager from './PlayerManager';
// import CollisionManager from './CollisionManager';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const playerManager = new PlayerManager();
const bulletManager = new BulletManager();
// const collisionManager = new CollisionManager();

playerManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    playerManager.updatePads();

    for (const player of playerManager.getPlayers()) {
        player.move();
        player.draw(ctx);
    }

    for (const bullet of bulletManager.getBullets()) {
        bullet.move();
        bullet.draw(ctx);
    }

    // for (const bullet of bulletManager.getBullets()) {
    //     for (const player of playerManager.getPlayers()) {
    //         const collision = collisionManager.checkCollisions(bullet, player);

    //         if (collision) {
    //             player.handleHit(bullet);
    //         }
    //     }
    // }

    requestAnimationFrame(loop);
}

function updateScreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = updateScreen;

updateScreen();
loop();
