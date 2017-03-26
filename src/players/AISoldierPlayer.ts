import Soldier from '../models/Soldier';
import Vector from '../utils/Vector';
import ISoldierPlayer from './ISoldierPlayer';

export default class AISoldierPlayer implements ISoldierPlayer {
    private turningLeft = Math.random() < 0.5;

    public move(soldier: Soldier) {
        const opponent = soldier.findBestOpponent();

        if (!opponent) {
            return;
        }

        const diffVector = Vector.fromDiff(soldier.position, opponent.position);
        const distance = Vector.getSize(diffVector);

        if (distance > 1000) {
            return;
        }

        // TODO: Improve this part.
        if (soldier.getCurrentSprite().hasToFinish()) {
            return;
        }

        let moveVector: Vector;

        if (distance > 400) {
            moveVector = Vector.toSize(diffVector, Math.min(soldier.getSpeed(), distance));
            soldier.setSprite(soldier.handgunSprites.move);
        } else if (distance > 300) {
            if (soldier.hasToReload()) {
                soldier.reload();
                return;
            }

            if (soldier.getShotTimeController().can()) {
                soldier.shot(opponent);
                return;
            }

            if (Math.random() < 0.02) {
                this.turningLeft = !this.turningLeft;
            }

            if (this.turningLeft) {
                moveVector = Vector.toSize({ x: -diffVector.y, y: diffVector.x }, soldier.getSpeed() / 2);
            } else {
                moveVector = Vector.toSize({ x: diffVector.y, y: -diffVector.x }, soldier.getSpeed() / 2);
            }

            soldier.setSprite(soldier.handgunSprites.idle);

        } else {
            moveVector = Vector.toSize({ x: -diffVector.x, y: -diffVector.y }, soldier.getSpeed());
            soldier.setSprite(soldier.handgunSprites.move);
        }

        soldier.position = Vector.add(soldier.position, moveVector);
        soldier.setAngle(Vector.toAngle(diffVector) + Math.PI / 2);
    }
}
