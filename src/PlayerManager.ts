import Bullet from './Bullet';
import Emitter from './Emitter';
import IGameObjectIterable from './IGameObjectIterable';
import Player from './Player';

export default class PlayerManager implements IGameObjectIterable {
    public bulletEmitter = new Emitter<Bullet>();
    public playerEmitter = new Emitter<Player>();
    public objectsCollide = true;
    private players: Player[] = [];

    public [Symbol.iterator]() {
        return this.players[Symbol.iterator]();
    }

    public updatePads() {
        const pads = navigator.getGamepads();

        for (const pad of pads) {
            if (!pad) {
                continue;
            }

            if (!this.players[pad.index]) {
                this.createPlayer(pad);
            }

            this.players[pad.index].update(pad);
        }
    }

    private createPlayer(pad: Gamepad) {
        const player = new Player();
        this.players[pad.index] = player;

        player.shotEmitter.subscribe(bullet => {
            this.bulletEmitter.emit(bullet);
        });

        player.deathEmitter.subscribe(() => {
            this.players = this.players.filter(p => p !== player);
        });

        this.playerEmitter.emit(player);
    }
}
