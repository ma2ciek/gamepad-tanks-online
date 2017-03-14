import Vector from '../utils/Vector';

interface ITankPlayer {
    isShooting(): boolean;
    isSpeedButtonPressed(): boolean;
    getMoveVector(): Vector;
    getGunVector(): Vector;
}

export default ITankPlayer;
