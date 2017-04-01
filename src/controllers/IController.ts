import { Vector } from '@ma2ciek/math';

interface IKeyBinding {
    SHOT_KEY: number;
    SPEED_UP: number;
}

interface IController {
    key: IKeyBinding;

    isPressed( keyCode: number ): boolean;
    getLeftAxis(): Vector;
    getRightAxis(): Vector;
}

export default IController;
