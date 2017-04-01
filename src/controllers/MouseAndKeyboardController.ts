import { Vector } from '@ma2ciek/math';
import Cursor from './Cursor';
import IController from './IController';

const defaultKeyBinding = {
    SPEED_UP: 16,
};

const defaultMouseButtonBinding = {
    SHOT_KEY: 1,
};

export default class MouseAndKeyboardController implements IController {
    private pressedButtons: { [ key: number ]: boolean } = {};
    private pressedMousedButtons: { [ key: number ]: boolean } = {};
    private gunVector = { x: 0, y: 0 };
    private cursor = new Cursor();

    constructor() {
        window.addEventListener( 'keydown', ( e ) => {
            this.pressedButtons[ e.keyCode ] = true;
            // if (e.preventDefault) { e.preventDefault(); }
            // if (e.stopPropagation) { e.stopPropagation(); }
            // console.log(e.keyCode);
        } );

        window.addEventListener( 'keyup', ( e ) => {
            this.pressedButtons[ e.keyCode ] = false;
            // if (e.preventDefault) { e.preventDefault(); }
            // if (e.stopPropagation) { e.stopPropagation(); }
        } );

        this.cursor.positionFromCenterEmitter.subscribe(( cursorPositionVector ) => {
            this.gunVector = cursorPositionVector;
        } );

        window.addEventListener( 'mousedown', ( e ) => {
            this.pressedMousedButtons[ e.which ] = true;
            if ( e.preventDefault ) { e.preventDefault(); }
            if ( e.stopPropagation ) { e.stopPropagation(); }
        } );

        window.addEventListener( 'mouseup', ( e ) => {
            this.pressedMousedButtons[ e.which ] = false;
            if ( e.preventDefault ) { e.preventDefault(); }
            if ( e.stopPropagation ) { e.stopPropagation(); }
        } );

        window.addEventListener( 'contextmenu', ( e ) => {
            e.preventDefault();
            e.stopPropagation();
        } );
    };

    public getCursor() {
        return this.cursor;
    }

    public get key() {
        return { ...defaultKeyBinding, ...defaultMouseButtonBinding };
    }

    public isPressed( button: number ) {
        return !!this.pressedButtons[ button ] || !!this.pressedMousedButtons[ button ];
    }

    public getLeftAxis() {
        const vector = new Vector(
            +this.isPressed( 68 ) - +this.isPressed( 65 ),
            +this.isPressed( 83 ) - +this.isPressed( 87 ),
        );

        return Vector.toSize( vector, 1 );
    }

    public getRightAxis() {
        return this.gunVector;
    }
}
