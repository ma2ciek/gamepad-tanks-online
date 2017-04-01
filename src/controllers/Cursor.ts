import { Emitter } from '@ma2ciek/events';
import { Vector } from '@ma2ciek/math';
import { ICameraOptions } from '../engine/ICamera';

export default class Cursor {
    public positionFromCenterEmitter = new Emitter<Vector>();

    private lockedElement: HTMLElement;
    private cursorPosition: Vector;

    public requestPointerLock( element: HTMLElement ) {
        this.lockedElement = element;
        this.cursorPosition = { x: 0, y: 0 };

        element.addEventListener( 'click', () => {
            element.requestPointerLock();
        } );

        document.addEventListener( 'pointerlockchange', this.lockChangeAlert, false );
    }

    public exitPointerLock() {
        document.exitPointerLock();
        document.removeEventListener( 'pointerlockchange', this.lockChangeAlert );
        document.removeEventListener( 'mousemove', this.handleMouseMove );
    }

    public draw( ctx: CanvasRenderingContext2D, options: ICameraOptions ) {
        if ( !this.cursorPosition ) {
            return;
        }

        // const ratio = options.width / ctx.canvas.width;

        // const x = this.cursorPosition.x * ratio - options.center.x;
        // const y = this.cursorPosition.y * ratio - options.center.y;

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc( this.cursorPosition.x, this.cursorPosition.y, 10, 0, 2 * Math.PI, false );
        ctx.stroke();
    }

    private lockChangeAlert = () => {
        if ( this.lockedElement === document.pointerLockElement ) {
            document.addEventListener( 'mousemove', this.handleMouseMove );
        } else {
            document.removeEventListener( 'mousemove', this.handleMouseMove );
        }
    }

    private handleMouseMove = ( e: MouseEvent ) => {
        this.cursorPosition = Vector.add( this.cursorPosition, {
            x: e.movementX,
            y: e.movementY,
        } );

        // if ( this.cursorPosition.x < 0 ) {
        //     this.cursorPosition.x = 0;
        // }

        // if ( this.cursorPosition.y < 0 ) {
        //     this.cursorPosition.y = 0;
        // }

        // if ( this.cursorPosition.x > this.lockedElement.clientWidth ) {
        //     this.cursorPosition.x = this.lockedElement.clientWidth;
        // }

        // if ( this.cursorPosition.y > this.lockedElement.clientHeight ) {
        //     this.cursorPosition.y = this.lockedElement.clientHeight;
        // }

        this.positionFromCenterEmitter.emit( Vector.add(
            this.cursorPosition,
            { x: -this.lockedElement.clientWidth / 2, y: -this.lockedElement.clientHeight / 2 },
        ) );
    }
}
