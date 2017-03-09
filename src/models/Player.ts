import E_100 from '../tank-models/E-100';
import Emitter from '../utils/Emitter';
import Vector from '../utils/Vector';
import Bullet from './Bullet';
import IGameObject, { ICollidingGameObject } from './IGameObject';
import Tank from './Tank';

const colors = [
    'green',
    'red',
    'blue',
];

export default class Player implements IGameObject {
    public shotEmitter = new Emitter<Bullet>();
    public deathEmitter = new Emitter();
    public type = 'player';

    public get position() {
        return this.tank.getPosition();
    }

    public kills = 0;
    public deaths = 0;
    public radius = 50;

    public color: string;
    private hp = 100;

    private pad: Gamepad;

    private tank: Tank;

    private lastShotTimestamp = Date.now();

    constructor(pad: Gamepad) {
        this.pad = pad;
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
            const gunVector = new Vector(this.pad.axes[2], this.pad.axes[3]);
            const gunAngle = Vector.toAngle(gunVector);
            const multiplier = Vector.getSize(gunVector);

            this.tank.rotateGun(gunAngle, multiplier);
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.tank.draw(ctx);
    }

    public handleHit(object: ICollidingGameObject) {
        if (object.type !== 'bullet' || object.owner === this) {
            return;
        }

        this.hp -= (object as any).damage;

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

        const bullet = new Bullet({
            position: startPosition,
            velocity: gunVector,
            owner: this,
            damage: this.tank.getBulletDamage(),
            radius: this.tank.getBulletRadius(),
        });

        this.lastShotTimestamp = Date.now();
        this.shotEmitter.emit(bullet);
    }
}
