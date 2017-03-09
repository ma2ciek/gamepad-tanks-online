import ITankModel from './ITankModel';

const E100: ITankModel = {
    url: '../images/tanks/E-100_strip2.png',
    tank: { x: 0, y: 0, width: 100, height: 170 },
    gun: { x: 95, y: 10, width: 100, height: 200 },
    tankCenter: { x: 50, y: 85 },
    gunCenter: { x: 145, y: 115 },
    gunSize: 70,
    tankSpeed: 3,
    tankRotationSpeed: Math.PI / 25,
    gunRotationSpeed: Math.PI / 30,
    bulletSpeed: 20,
    shotDuration: 500,
    bulletDamage: 40,
    bulletRadius: 5,
};

export default E100;
