import { IRGB } from '@ma2ciek/canvas';
import { Vector } from '@ma2ciek/math';

interface ITankPlayer {
    isShooting(): boolean;
    isSpeedButtonPressed(): boolean;
    getMoveVector(): Vector;
    getGunVector(): Vector;
    getColor(): IRGB;
}

export default ITankPlayer;
