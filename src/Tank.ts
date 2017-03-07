import { drawImage, drawRect, loadImage, normalizeAngle } from './utils';
import Vector from './Vector';

export interface ITankModel {
    url: string;
    tank: IRect;
    gun: IRect;
    tankCenter: Vector;
    gunCenter: Vector;
    gunSize: number;
    tankSpeed: number;
    tankRotationSpeed: number;
    gunRotationSpeed: number;
    bulletSpeed: number;
    shotFrequency: number;
}

interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default class Tank {
    private model: ITankModel;
    private gunAngle = Math.atan2(0, 0);
    private tankAngle = Math.atan2(0, 0);
    private image: HTMLImageElement;
    private position = new Vector(
        Math.random() * 100,
        Math.random() * 100,
    );

    constructor(model: ITankModel) {
        this.model = model;

        loadImage(model.url)
            .then(image => this.image = image);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (!this.image) {
            return;
        }

        this.drawTank(ctx);
        this.drawGun(ctx);
    }

    public move(moveVector: Vector) {
        const moveAngle = Vector.toAngle(moveVector);
        const absMoveForce = Math.abs(Math.cos(moveAngle - this.tankAngle) * this.model.tankSpeed);

        const newMoveVector = Vector.times(moveVector, absMoveForce);

        if (moveVector.x !== 0 || moveVector.y !== 0) {
            this.rotateTank(moveAngle, Vector.getSize(moveVector));
        }

        this.position = Vector.add(this.position, newMoveVector);
    }

    public rotateTank(angle: number, multiplier: number) {
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

    public rotateGun(gunAngle: number) {
        const movement = Math.min(this.model.gunRotationSpeed, Math.abs(this.gunAngle - gunAngle));

        if ((this.gunAngle - gunAngle > 0 && this.gunAngle - gunAngle < Math.PI) ||
            this.gunAngle - gunAngle < -Math.PI) {
            this.gunAngle -= movement;
        } else {
            this.gunAngle += movement;
        }

        this.gunAngle = normalizeAngle(this.gunAngle);
    }

    public getGunAngle() {
        return this.gunAngle;
    }

    public getBulletSpeed() {
        return this.model.bulletSpeed;
    }

    public getPosition() {
        return this.position;
    }

    public getGunSize() {
        return this.model.gunSize;
    }

    public getShotFrequency() {
        return this.model.shotFrequency;
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
