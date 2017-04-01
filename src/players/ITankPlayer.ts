import { Vector } from '@ma2ciek/math';

interface ITankPlayer {
    isShooting(): boolean;
    isSpeedButtonPressed(): boolean;
    getMoveVector(): Vector;
    getGunVector(): Vector;
    getHue(): number;
}

export default ITankPlayer;
