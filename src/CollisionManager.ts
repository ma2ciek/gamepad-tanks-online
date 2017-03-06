import Vector from './Vector';

interface ICircle {
    position: Vector;
    radius: number;
}

export default class CollisionManager {
    public checkCollisions(o1: ICircle, o2: ICircle) {
        return o1.radius + o2.radius > Vector.squaredDistance(o1.position, o2.position)
    }
}
