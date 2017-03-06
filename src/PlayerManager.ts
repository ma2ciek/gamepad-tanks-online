import Bullet from './Bullet';
import Emitter from './Emitter';
import Player from './Player';

export default class PlayerManager {
    public bulletEmitter = new Emitter<Bullet>();

    private players: Player[] = [];

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

    public getPlayers() {
        return this.players;
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
    }
}
