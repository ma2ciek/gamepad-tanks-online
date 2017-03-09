import Bullet from '../models/Bullet';
import IGameObject from '../models/IGameObject';
import Soldier from '../models/Soldier';
import Emitter from '../utils/Emitter';
import Vector from '../utils/Vector';
import IGameObjectCollection from './IGameObjectCollection';

export default class SoldierManager implements IGameObjectCollection {
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
