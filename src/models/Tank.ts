import { Howl } from 'howler';
import ITankPlayer from '../players/ITankPlayer';
import ITankModel from '../tank-models/ITankModel';
import Emitter from '../utils/Emitter';
import TimeController from '../utils/TimeController';
import { drawImage, drawRect, loadImage, normalizeAngle } from '../utils/utils';
import Vector from '../utils/Vector';
import Bullet from './Bullet';
import IGameObject, { ICollidingGameObject } from './IGameObject';

export interface ITankOptions {
    player: ITankPlayer;
    position: Vector;
    model: ITankModel;
    type: 'tank';
}

export default class Tank implements IGameObject, ICollidingGameObject {
    public bulletEmitter = new Emitter<Bullet>();
    public deathEmitter = new Emitter();

    public model: ITankModel;
    public position: Vector;
    public type: 'tank' = 'tank';
    public radius = 40;

    private hp: number;
    private gunAngle = Math.atan2(0, 0);
    private tankAngle = Math.atan2(0, 0);
    private image: HTMLImageElement;
    private shotSound = new Howl({
        src: '/audio/sounds/tank-shot.mp3',
        preload: true,
    });
    private player: ITankPlayer;
    private shotTimeController: TimeController;

    constructor(options: ITankOptions) {
        this.model = options.model;
        this.hp = options.model.hp;

        this.shotTimeController = new TimeController(1000);

        this.player = options.player;

        this.position = options.position;

        loadImage(this.model.url)
            .then(image => this.image = image);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (!this.image) {
            return;
        }

        this.drawTank(ctx);
        this.drawGun(ctx);
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

    public move() {
        let moveVector = this.player.getMoveVector();
        let gunVector = this.player.getGunVector();

        if (this.player.isSpeedButtonPressed()) {
            moveVector = Vector.times(moveVector, 2);
            gunVector = Vector.times(gunVector, 2);
        }

        const gunAngle = Vector.toAngle(gunVector);
        const multiplier = Vector.getSize(gunVector);

        this.moveTank(moveVector);
        this.rotateGun(gunAngle, multiplier);

        this.maybeShot();
    }

    private moveTank(moveVector: Vector) {
        const moveAngle = Vector.toAngle(moveVector);
        const absMoveForce = Math.abs(Math.cos(moveAngle - this.tankAngle) * this.model.tankSpeed);

        const newMoveVector = Vector.times(moveVector, absMoveForce);

        if (moveVector.x !== 0 || moveVector.y !== 0) {
            this.rotateTank(moveAngle, Vector.getSize(moveVector));
        }

        this.position = Vector.add(this.position, newMoveVector);

        if (this.position.x > 3000) {
            this.position.x = 3000;
        }

        if (this.position.x < -3000) {
            this.position.x = -3000;
        }

        if (this.position.y > 3000) {
            this.position.y = 3000;
        }

        if (this.position.y < -3000) {
            this.position.y = -3000;
        }
    }

    private rotateTank(angle: number, multiplier: number) {
        const angleDiff = Math.abs(this.tankAngle - angle);
        const movement = Math.min(this.model.tankRotationSpeed * multiplier, angleDiff);

        if ((this.tankAngle - angle > 0 && this.tankAngle - angle < Math.PI) ||
            this.tankAngle - angle < -Math.PI) {
            this.tankAngle -= movement;
        } else {
            this.tankAngle += movement;
        }

        this.tankAngle = normalizeAngle(this.tankAngle);
    }

    private rotateGun(gunAngle: number, multiplier: number) {
        const movement = Math.min(this.model.gunRotationSpeed * multiplier, Math.abs(this.gunAngle - gunAngle));

        if ((this.gunAngle - gunAngle > 0 && this.gunAngle - gunAngle < Math.PI) ||
            this.gunAngle - gunAngle < -Math.PI) {
            this.gunAngle -= movement;
        } else {
            this.gunAngle += movement;
        }

        this.gunAngle = normalizeAngle(this.gunAngle);
    }

    private getBulletSpeed() {
        return this.model.bulletSpeed;
    }

    private getPosition() {
        return this.position;
    }

    private getGunSize() {
        return this.model.gunSize;
    }

    private getBulletDamage() {
        return this.model.bulletDamage;
    }

    private getBulletRadius() {
        return this.model.bulletRadius;
    }

    private maybeShot() {
        if (!this.player.isShooting() || !this.shotTimeController.can()) {
            return;
        }

        const gunVector = Vector.fromAngle(this.gunAngle, this.getBulletSpeed());
        const startPosition = Vector.add(this.getPosition(), Vector.toSize(gunVector, this.getGunSize()));

        const bullet = new Bullet({
            position: startPosition,
            velocity: gunVector,
            owner: this,
            damage: this.getBulletDamage(),
            radius: this.getBulletRadius(),
        });

        this.bulletEmitter.emit(bullet);
        this.shotSound.play();
    }

    private drawTank(ctx: CanvasRenderingContext2D) {
        drawImage({
            ctx,
            image: this.image,
            x: this.model.tank.x,
            y: this.model.tank.y,
            width: this.model.tank.width,
            height: this.model.tank.height,
            canvasOffsetX: this.position.x,
            canvasOffsetY: this.position.y,
            angle: this.tankAngle,
            center: this.model.tankCenter,
        });

        if ((window as any).debugMode) {
            drawRect({
                ctx,
                x: this.position.x,
                y: this.position.y,
                width: this.model.tank.width,
                height: this.model.tank.height,
                strokeStyle: 'red',
                strokeWidth: 1,
            });
        }
    }

    private drawGun(ctx: CanvasRenderingContext2D) {
        drawImage({
            ctx,
            image: this.image,
            x: this.model.gun.x,
            y: this.model.gun.y,
            width: this.model.gun.width,
            height: this.model.gun.height,
            canvasOffsetX: this.position.x,
            canvasOffsetY: this.position.y,
            angle: this.gunAngle,
            center: this.model.gunCenter,
        });

        if ((window as any).debugMode) {
            drawRect({
                ctx,
                x: this.position.x,
                y: this.position.y,
                width: this.model.gun.width,
                height: this.model.gun.height,
                strokeStyle: 'blue',
                strokeWidth: 1,
            });
        }
    }
}
