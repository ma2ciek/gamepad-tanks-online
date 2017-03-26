import Soldier from '../models/Soldier';

interface ISoldierPlayer {
    move(soldier: Soldier): void;
}

export default ISoldierPlayer;
