import ControllerManager from './controllers/ControllerManager';
import Game from './Game';
// import AISoldierPlayer from './players/AISoldierPlayer';
import HumanTankPlayer from './players/HumanTankPlayer';
import E100 from './tank-models/E-100';

const controllerManager = new ControllerManager();

const game = new Game( {
    audioTheme: '/audio/theme/FragileCeiling.ogg',
    backgrounds: [ { colors: [ '#3a3', '#6a2' ] }],
    units: [ ],
    cursor: controllerManager.getCursor(),
} );

controllerManager.newControllerEmitter.subscribe(( controller ) => {
    game.addUnit( {
        type: 'tank',
        position: { x: 1000 * Math.random(), y: 1000 * Math.random() },
        player: new HumanTankPlayer( controller ),
        model: E100,
    } );
} );

game.play();

( window as any ).game = game;
