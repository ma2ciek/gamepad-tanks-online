import Bullet from '../models/Bullet';
import IGameObject from '../models/IGameObject';
import Soldier, { ISoldierOptions } from '../models/Soldier';
import Tank, { ITankOptions } from '../models/Tank';
import Emitter from '../utils/Emitter';
import IGameObjectCollection from './IGameObjectCollection';

export type IUnitOptions = ISoldierOptions | ITankOptions;

export default class UnitManager implements IGameObjectCollection {
    public bulletEmitter = new Emitter<Bullet>();
    public objectsCollide = true;

    private units: IGameObject[] = [];

    public [Symbol.iterator]() {
        return this.units[Symbol.iterator]();
    }

    public create(options: IUnitOptions) {
        const unit = this.getInstance(options);

        // TODO.
        if (unit.type === 'soldier') {
            unit.track(this);
        }

        unit.bulletEmitter.subscribe(bullet => this.bulletEmitter.emit(bullet));
        unit.deathEmitter.subscribe(() => {
            this.units = this.units.filter(u => u !== unit);
        });

        this.units.push(unit);
    }

    private getInstance(options: IUnitOptions) {
        switch (options.type) {
            case 'soldier':
                return new Soldier(options);
            case 'tank':
                return new Tank(options);
            default:
                throw new Error('not implemented for ' + (options as any).type);
        }
    }
}
