import { normalizeAngle } from './utils';

export default class Vector {
    public static copy(vector: Vector) {
        return new Vector(vector.x, vector.y);
    }

    public static add(v1: Vector, v2: Vector) {
        return new Vector(
            v1.x + v2.x,
            v1.y + v2.y,
        );
    }

    public static times(v: Vector, value: number) {
        return new Vector(
            v.x * value,
            v.y * value,
        );
    }

    public static squaredDistance(v1: Vector, v2: Vector) {
        return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;
    }

    public static toSize(v: Vector, size: number) {
        const times = size / Math.sqrt(v.x * v.x + v.y * v.y);
        return Vector.times(v, times);
    }

    public static fromAngle(angle: number, radius: number) {
        return new Vector(
            Math.cos(angle + Math.PI / 2) * radius,
            Math.sin(angle + Math.PI / 2) * radius,
        );
    }

    public static toAngle(v: Vector) {
        const angle = Math.atan2(v.y, v.x) - Math.PI / 2;
        return normalizeAngle(angle);
    }

    constructor(
        public x: number,
        public y: number,
    ) { }
}

(window as any).Vector = Vector;
