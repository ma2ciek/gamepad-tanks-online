import ControllerManager from './controllers/ControllerManager';
import Game from './Game';
// import AISoldierPlayer from './players/AISoldierPlayer';
import HumanTankPlayer from './players/HumanTankPlayer';
import E100 from './tank-models/E-100';

const controllerManager = new ControllerManager();

controllerManager.newControllerEmitter.subscribe(( controller ) => {
    if ( controllerManager.getControllers().length === 2 ) {
        start();
    }
} );

function start() {
    const controllers = controllerManager.getControllers();

    const game = new Game( {
        audioTheme: '/audio/theme/FragileCeiling.ogg',
        backgrounds: [ { colors: [ '#3a3', '#6a2' ] }],
        units: [ {
            type: 'tank',
            position: { x: 200, y: 200 },
            player: new HumanTankPlayer( controllers[ 0 ] ),
            model: E100,
        }, {
            type: 'tank',
            position: { x: 300, y: 300 },
            player: new HumanTankPlayer( controllers[ 1 ] ),
            model: E100,
        }],
        cursor: controllerManager.getCursor(),
    } );

    game.play();

    ( window as any ).game = game;
}
