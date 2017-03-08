import Bullet from './Bullet';
import Emitter from './Emitter';
import IGameObject from './IGameObject';
import IGameObjectIterable from './IGameObjectIterable';
import Soldier from './Soldier';
import Vector from './Vector';

export default class SoldierManager implements IGameObjectIterable {
    public bulletEmitter = new Emitter<Bullet>();
    public objectsCollide = true;

    private soldiers: Soldier[] = [];
    private trackedObjects: Iterable<IGameObject>;

    public [Symbol.iterator]() {
        return this.soldiers[Symbol.iterator]();
    }

    public addSoldiers(startPositions: Vector[]) {
        for (const position of startPositions) {
            const soldier = new Soldier(position);

            soldier.track(this.trackedObjects);

            soldier.shotEmitter.subscribe(bullet => this.bulletEmitter.emit(bullet));
            soldier.deathEmitter.subscribe(() => {
                this.soldiers = this.soldiers.filter(s => s !== soldier);
            });

            this.soldiers.push(soldier);
        }
    }

    public track(manager: Iterable<IGameObject>) {
        this.trackedObjects = manager;
    }
}
