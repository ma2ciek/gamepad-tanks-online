import Vector from '../utils/Vector';

interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ITankModel {
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
    shotDuration: number;
    bulletDamage: number;
    bulletRadius: number;
    hp: number;
}

export default ITankModel;
