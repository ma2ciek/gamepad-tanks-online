import Bullet from './Bullet';
import Emitter from './Emitter';
import Tank from './Tank';
import E_100 from './tanks/E-100';
import Vector from './Vector';

const colors = [
    'green',
    'red',
    'blue',
];

export default class Player {
    public shotEmitter = new Emitter<Bullet>();
    public deathEmitter = new Emitter();

    public hp = 100;
    public kills = 0;
    public deaths = 0;

    public color: string;

    private pad: Gamepad;

    private tank: Tank;

    private lastShotTimestamp = Date.now();

    constructor() {
        this.tank = new Tank(E_100);
    }

    public update(pad: Gamepad) {
        this.pad = pad;

        this.color = colors[this.pad.index];

        const clickedButtons = this.pad.buttons.map(b => b.pressed);

        clickedButtons.forEach((buttonClicked, i) => {
            if (clickedButtons[i]) {
                if (i === 5) {
                    this.maybeShot();
                }
            }
        });
    }

    public move() {
        let moveVector = new Vector(this.pad.axes[0], this.pad.axes[1]);

        if (this.pad.buttons[7].pressed) {
            moveVector = Vector.times(moveVector, 2);
        }

        this.tank.move(moveVector);

        if (this.pad.axes[2] !== 0 && this.pad.axes[3] !== 0) {
            const gunAngle = Vector.toAngle(new Vector(this.pad.axes[2], this.pad.axes[3]));

            this.tank.rotateGun(gunAngle);
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.tank.draw(ctx);
    }

    public handleHit(bullet: Bullet) {
        if (bullet.owner === this) {
            return;
        }

        this.hp -= 10;

        if (this.hp <= 0) {
            this.deathEmitter.emit({});
        }
    }

    private maybeShot() {
        if (this.lastShotTimestamp + this.tank.getShotFrequency() > Date.now()) {
            return;
        }

        const gunVector = Vector.fromAngle(this.tank.getGunAngle(), this.tank.getBulletSpeed());
        const startPosition = Vector.add(this.tank.getPosition(), Vector.toSize(gunVector, this.tank.getGunSize()));

        const bullet = new Bullet(startPosition, gunVector, this);

        this.lastShotTimestamp = Date.now();
        this.shotEmitter.emit(bullet);
    }
}
