import { drawImage, drawRect, Layer } from '@ma2ciek/canvas';
import Emitter from '@ma2ciek/events/src/Emitter';
import loadImage from '@ma2ciek/loaders/src/loadImage';
import normalizeAngle from '@ma2ciek/math/src/normalizeAngle';
import Vector from '@ma2ciek/math/src/Vector';
import ITankPlayer from '../players/ITankPlayer';
import ITankModel from '../tank-models/ITankModel';
import TimeController from '../utils/TimeController';
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
    private maxHp: number;
    private gunAngle = Math.atan2( 0, 0 );
    private tankAngle = Math.atan2( 0, 0 );
    private originalTankImage: HTMLImageElement;
    private image: Layer;
    private player: ITankPlayer;
    private shotTimeController: TimeController;

    constructor( options: ITankOptions ) {
        this.model = options.model;
        this.hp = options.model.hp;
        this.maxHp = options.model.hp;

        this.shotTimeController = new TimeController( 1000 );

        this.player = options.player;

        this.position = options.position;

        loadImage( this.model.url )
            .then( image => {
                this.originalTankImage = image;
                this.image = Layer.fromImage( image ).colorize( options.player.getHue(), 0.1 );
            } );
    }

    public draw( ctx: CanvasRenderingContext2D ) {
        if ( !this.originalTankImage ) {
            return;
        }

        this.drawTank( ctx );
        this.drawGun( ctx );
        this.drawTankInfo( ctx );
    }

    public handleHit( object: ICollidingGameObject ) {
        if ( object.type !== 'bullet' || object.owner === this ) {
            return;
        }

        this.hp -= ( object as any ).damage;

        if ( this.hp <= 0 ) {
            this.deathEmitter.emit( {} );
        }
    }

    public move() {
        let moveVector = this.player.getMoveVector();
        let gunVector = this.player.getGunVector();

        if ( this.player.isSpeedButtonPressed() ) {
            moveVector = Vector.times( moveVector, 2 );
            gunVector = Vector.times( gunVector, 2 );
        }

        const gunAngle = Vector.toAngle( gunVector );
        const multiplier = Vector.getSize( gunVector );

        this.moveTank( moveVector );
        this.rotateGun( gunAngle, multiplier );

        this.maybeShot();
    }

    private moveTank( moveVector: Vector ) {
        const moveAngle = Vector.toAngle( moveVector );
        const absMoveForce = Math.abs( Math.cos( moveAngle - this.tankAngle ) * this.model.tankSpeed );

        const newMoveVector = Vector.times( moveVector, absMoveForce );

        if ( moveVector.x !== 0 || moveVector.y !== 0 ) {
            this.rotateTank( moveAngle, Vector.getSize( moveVector ) );
        }

        this.position = Vector.add( this.position, newMoveVector );

        if ( this.position.x > 3000 ) {
            this.position.x = 3000;
        }

        if ( this.position.x < -3000 ) {
            this.position.x = -3000;
        }

        if ( this.position.y > 3000 ) {
            this.position.y = 3000;
        }

        if ( this.position.y < -3000 ) {
            this.position.y = -3000;
        }
    }

    private rotateTank( angle: number, multiplier: number ) {
        const angleDiff = Math.abs( this.tankAngle - angle );
        const movement = Math.min( this.model.tankRotationSpeed * multiplier, angleDiff );

        if ( ( this.tankAngle - angle > 0 && this.tankAngle - angle < Math.PI ) ||
            this.tankAngle - angle < -Math.PI ) {
            this.tankAngle -= movement;
        } else {
            this.tankAngle += movement;
        }

        this.tankAngle = normalizeAngle( this.tankAngle );
    }

    private rotateGun( gunAngle: number, multiplier: number ) {
        const movement = Math.min( this.model.gunRotationSpeed * multiplier, Math.abs( this.gunAngle - gunAngle ) );

        if ( ( this.gunAngle - gunAngle > 0 && this.gunAngle - gunAngle < Math.PI ) ||
            this.gunAngle - gunAngle < -Math.PI ) {
            this.gunAngle -= movement;
        } else {
            this.gunAngle += movement;
        }

        this.gunAngle = normalizeAngle( this.gunAngle );
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
        if ( !this.player.isShooting() || !this.shotTimeController.can() ) {
            return;
        }

        const gunVector = Vector.fromAngle( this.gunAngle, this.getBulletSpeed() );
        const startPosition = Vector.add( this.getPosition(), Vector.toSize( gunVector, this.getGunSize() ) );

        const bullet = new Bullet( {
            position: startPosition,
            velocity: gunVector,
            owner: this,
            damage: this.getBulletDamage(),
            radius: this.getBulletRadius(),
        } );

        this.bulletEmitter.emit( bullet );
    }

    private drawTank( ctx: CanvasRenderingContext2D ) {
        drawImage( {
            ctx,
            image: this.image.getCanvas(),
            x: this.model.tank.x,
            y: this.model.tank.y,
            width: this.model.tank.width,
            height: this.model.tank.height,
            canvasOffsetX: this.position.x,
            canvasOffsetY: this.position.y,
            angle: this.tankAngle,
            center: this.model.tankCenter,
        } );

        if ( ( window as any ).debugMode ) {
            drawRect( {
                ctx,
                x: this.position.x,
                y: this.position.y,
                width: this.model.tank.width,
                height: this.model.tank.height,
                strokeStyle: 'red',
                strokeWidth: 1,
            } );
        }
    }

    private drawGun( ctx: CanvasRenderingContext2D ) {
        drawImage( {
            ctx,
            image: this.originalTankImage,
            x: this.model.gun.x,
            y: this.model.gun.y,
            width: this.model.gun.width,
            height: this.model.gun.height,
            canvasOffsetX: this.position.x,
            canvasOffsetY: this.position.y,
            angle: this.gunAngle,
            center: this.model.gunCenter,
        } );

        if ( ( window as any ).debugMode ) {
            drawRect( {
                ctx,
                x: this.position.x,
                y: this.position.y,
                width: this.model.gun.width,
                height: this.model.gun.height,
                strokeStyle: 'blue',
                strokeWidth: 1,
            } );
        }
    }

    private drawTankInfo( ctx: CanvasRenderingContext2D ) {
        ctx.fillStyle = 'black';
        const text = Math.floor( this.hp / this.maxHp * 100 ).toFixed( 0 ) + '%';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '25px Arial';

        ctx.fillText( text, this.position.x, this.position.y );
    }
}
