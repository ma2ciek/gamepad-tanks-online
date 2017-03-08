import Bullet from './Bullet';
import Emitter from './Emitter';
import IGameObjectIterable from './IGameObjectIterable';
import Player from './Player';

export default class PlayerManager implements IGameObjectIterable {
    public bulletEmitter = new Emitter<Bullet>();
    public playerEmitter = new Emitter<Player>();
    public objectsCollide = true;
    private players: { [id: string]: Player } = {};

    public *[Symbol.iterator]() {
        const ids = Object.keys(this.players);

        for (const id of ids) {
            yield this.players[id];
        }
    }

    public updatePads() {
        const pads = navigator.getGamepads();

        Array.from(pads).forEach((pad, index) => {
            if (!pad) {
                return;
            }

            if (!this.players[pad.id]) {
                this.addPlayer(pad);
            }

            this.players[pad.id].update(pad);
        });
    }

    private addPlayer(pad: Gamepad) {
        const player = this.createPlayer(pad);
        this.players[pad.id] = player;

        this.playerEmitter.emit(player);
    }

    private createPlayer(pad: Gamepad) {
        const player = new Player(pad);

        player.shotEmitter.subscribe(bullet => {
            this.bulletEmitter.emit(bullet);
        });

        player.deathEmitter.subscribe(() => {
            this.players[pad.id] = this.createPlayer(pad);
        });

        return player;
    }
}
