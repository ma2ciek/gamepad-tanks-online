(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ControllerManager_1 = require("./controllers/ControllerManager");
const Game_1 = require("./Game");
// import AISoldierPlayer from './players/AISoldierPlayer';
const HumanTankPlayer_1 = require("./players/HumanTankPlayer");
const E_100_1 = require("./tank-models/E-100");
const controllerManager = new ControllerManager_1.default();
const game = new Game_1.default({
    audioTheme: '/audio/theme/FragileCeiling.ogg',
    backgrounds: [{ colors: ['#3a3', '#6a2'] }],
    units: [],
    cursor: controllerManager.getCursor(),
});
controllerManager.newControllerEmitter.subscribe((controller) => {
    game.addUnit({
        type: 'tank',
        position: { x: 1000 * Math.random(), y: 1000 * Math.random() },
        player: new HumanTankPlayer_1.default(controller),
        model: E_100_1.default,
    });
});
game.play();
window.game = game;
//# sourceMappingURL=index.js.map
});
___scope___.file("controllers/ControllerManager.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("@ma2ciek/events");
const MouseAndKeyboardController_1 = require("./MouseAndKeyboardController");
const PadController_1 = require("./PadController");
class ControllerManager {
    constructor() {
        this.newControllerEmitter = new events_1.Emitter();
        this.padControllers = {};
        this.mouseAndKeyboardController = new MouseAndKeyboardController_1.default();
        this.update = () => {
            this.updatePads();
            requestAnimationFrame(this.update);
        };
        setTimeout(() => {
            this.update();
            this.newControllerEmitter.emit(this.mouseAndKeyboardController);
        });
    }
    getCursor() {
        return this.mouseAndKeyboardController.getCursor();
    }
    getControllers() {
        return [
            this.mouseAndKeyboardController,
            ...Object.keys(this.padControllers).map(id => this.padControllers[id]),
        ].filter(c => !!c);
    }
    updatePads() {
        const pads = navigator.getGamepads();
        Array.from(pads).forEach((pad, index) => {
            if (!pad) {
                return;
            }
            if (!this.padControllers[pad.id]) {
                this.addPad(pad);
                this.padControllers[pad.id].update(pad);
                this.newControllerEmitter.emit(this.padControllers[pad.id]);
            }
            else {
                this.padControllers[pad.id].update(pad);
            }
        });
    }
    addPad(pad) {
        this.padControllers[pad.id] = new PadController_1.default();
    }
}
exports.default = ControllerManager;
//# sourceMappingURL=ControllerManager.js.map
});
___scope___.file("controllers/MouseAndKeyboardController.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("@ma2ciek/math");
const Cursor_1 = require("./Cursor");
const defaultKeyBinding = {
    SPEED_UP: 16,
};
const defaultMouseButtonBinding = {
    SHOT_KEY: 1,
};
class MouseAndKeyboardController {
    constructor() {
        this.pressedButtons = {};
        this.pressedMousedButtons = {};
        this.gunVector = { x: 0, y: 0 };
        this.cursor = new Cursor_1.default();
        window.addEventListener('keydown', (e) => {
            this.pressedButtons[e.keyCode] = true;
            // if (e.preventDefault) { e.preventDefault(); }
            // if (e.stopPropagation) { e.stopPropagation(); }
            // console.log(e.keyCode);
        });
        window.addEventListener('keyup', (e) => {
            this.pressedButtons[e.keyCode] = false;
            // if (e.preventDefault) { e.preventDefault(); }
            // if (e.stopPropagation) { e.stopPropagation(); }
        });
        this.cursor.positionFromCenterEmitter.subscribe((cursorPositionVector) => {
            this.gunVector = cursorPositionVector;
        });
        window.addEventListener('mousedown', (e) => {
            this.pressedMousedButtons[e.which] = true;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        });
        window.addEventListener('mouseup', (e) => {
            this.pressedMousedButtons[e.which] = false;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        });
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }
    ;
    getCursor() {
        return this.cursor;
    }
    get key() {
        return Object.assign({}, defaultKeyBinding, defaultMouseButtonBinding);
    }
    isPressed(button) {
        return !!this.pressedButtons[button] || !!this.pressedMousedButtons[button];
    }
    getLeftAxis() {
        const vector = new math_1.Vector(+this.isPressed(68) - +this.isPressed(65), +this.isPressed(83) - +this.isPressed(87));
        return math_1.Vector.toSize(vector, 1);
    }
    getRightAxis() {
        return this.gunVector;
    }
}
exports.default = MouseAndKeyboardController;
//# sourceMappingURL=MouseAndKeyboardController.js.map
});
___scope___.file("controllers/Cursor.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("@ma2ciek/events");
const math_1 = require("@ma2ciek/math");
class Cursor {
    constructor() {
        this.positionFromCenterEmitter = new events_1.Emitter();
        this.lockChangeAlert = () => {
            if (this.lockedElement === document.pointerLockElement) {
                document.addEventListener('mousemove', this.handleMouseMove);
            }
            else {
                document.removeEventListener('mousemove', this.handleMouseMove);
            }
        };
        this.handleMouseMove = (e) => {
            this.cursorPosition = math_1.Vector.add(this.cursorPosition, {
                x: e.movementX,
                y: e.movementY,
            });
            // if ( this.cursorPosition.x < 0 ) {
            //     this.cursorPosition.x = 0;
            // }
            // if ( this.cursorPosition.y < 0 ) {
            //     this.cursorPosition.y = 0;
            // }
            // if ( this.cursorPosition.x > this.lockedElement.clientWidth ) {
            //     this.cursorPosition.x = this.lockedElement.clientWidth;
            // }
            // if ( this.cursorPosition.y > this.lockedElement.clientHeight ) {
            //     this.cursorPosition.y = this.lockedElement.clientHeight;
            // }
            this.positionFromCenterEmitter.emit(math_1.Vector.add(this.cursorPosition, { x: -this.lockedElement.clientWidth / 2, y: -this.lockedElement.clientHeight / 2 }));
        };
    }
    requestPointerLock(element) {
        this.lockedElement = element;
        this.cursorPosition = { x: 0, y: 0 };
        element.addEventListener('click', () => {
            element.requestPointerLock();
        });
        document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
    }
    exitPointerLock() {
        document.exitPointerLock();
        document.removeEventListener('pointerlockchange', this.lockChangeAlert);
        document.removeEventListener('mousemove', this.handleMouseMove);
    }
    draw(ctx, options) {
        if (!this.cursorPosition) {
            return;
        }
        // const ratio = options.width / ctx.canvas.width;
        // const x = this.cursorPosition.x * ratio - options.center.x;
        // const y = this.cursorPosition.y * ratio - options.center.y;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.cursorPosition.x, this.cursorPosition.y, 10, 0, 2 * Math.PI, false);
        ctx.stroke();
    }
}
exports.default = Cursor;
//# sourceMappingURL=Cursor.js.map
});
___scope___.file("controllers/PadController.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("@ma2ciek/math");
const defaultKeyBinding = {
    SHOT_KEY: 5,
    SPEED_UP: 7,
};
class PadController {
    get key() {
        return defaultKeyBinding;
    }
    update(pad) {
        this.pad = pad;
    }
    isPressed(button) {
        return this.pad.buttons[button].pressed;
    }
    getLeftAxis() {
        return new math_1.Vector(this.pad.axes[0], this.pad.axes[1]);
    }
    getRightAxis() {
        return new math_1.Vector(this.pad.axes[2], this.pad.axes[3]);
    }
}
exports.default = PadController;
//# sourceMappingURL=PadController.js.map
});
___scope___.file("Game.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BackgroundManager_1 = require("./collections/BackgroundManager");
const BulletManager_1 = require("./collections/BulletManager");
const UnitManager_1 = require("./collections/UnitManager");
const Renderer_1 = require("./engine/Renderer");
const Scene_1 = require("./engine/Scene");
const WholeViewCamera_1 = require("./engine/WholeViewCamera");
class Game {
    constructor(map) {
        this.cursor = map.cursor;
        this.canvas = document.getElementById('canvas');
        const ctx = this.canvas.getContext('2d');
        this.unitManager = new UnitManager_1.default();
        const bulletManager = new BulletManager_1.default();
        for (const object of map.units) {
            this.unitManager.create(object);
        }
        this.unitManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));
        const backgroundManager = BackgroundManager_1.default.fromJSON(map.backgrounds);
        const scene = new Scene_1.default(backgroundManager, bulletManager, this.unitManager);
        scene.addStaticElements(this.cursor);
        const camera = new WholeViewCamera_1.default();
        camera.track(this.unitManager);
        this.renderer = new Renderer_1.default({
            scene,
            ctx,
            camera,
        });
    }
    play() {
        this.renderer.render();
        this.cursor.requestPointerLock(this.canvas);
    }
    pause() {
        this.renderer.stop();
        this.cursor.exitPointerLock();
    }
    addUnit(unitOptions) {
        this.unitManager.create(unitOptions);
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map
});
___scope___.file("collections/BackgroundManager.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClassicBackground_1 = require("../models/ClassicBackground");
class BackgroundManager {
    constructor() {
        this.objectsCollide = false;
        this.backgrounds = [];
    }
    static fromJSON(backgrounds) {
        const backgroundManager = new BackgroundManager();
        // TODO
        for (const background of backgrounds) {
            backgroundManager.add(new ClassicBackground_1.default(background.colors));
        }
        return backgroundManager;
    }
    [Symbol.iterator]() {
        return this.backgrounds[Symbol.iterator]();
    }
    add(bg) {
        this.backgrounds.push(bg);
    }
}
exports.default = BackgroundManager;
//# sourceMappingURL=BackgroundManager.js.map
});
___scope___.file("models/ClassicBackground.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
class ClassicBackground {
    constructor(colors) {
        this.colors = colors;
        this.position = { x: 0, y: 0 };
        this.type = 'background';
    }
    draw(ctx, { center, width, height }) {
        const tileSize = 100;
        const startX = Math.floor((center.x - width / 2) / tileSize) * tileSize;
        const startY = Math.floor((center.y - height / 2) / tileSize) * tileSize;
        for (let x = startX; x < center.x + width / 2; x += tileSize) {
            for (let y = startY; y < center.y + height / 2; y += tileSize) {
                // TODO: this.colors.length
                ctx.fillStyle = this.colors[utils_1.mod(x + y, tileSize * 2) / tileSize];
                ctx.fillRect(x, y, tileSize + 1, tileSize + 1);
            }
        }
    }
    move() {
        // Empty - TODO (?)
    }
}
exports.default = ClassicBackground;
//# sourceMappingURL=ClassicBackground.js.map
});
___scope___.file("utils/utils.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createArray(size, filler) {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = filler;
    }
    return arr;
}
exports.createArray = createArray;
function mod(x, y) {
    const result = x % y;
    return (result >= 0) ?
        result :
        result + y;
}
exports.mod = mod;
//# sourceMappingURL=utils.js.map
});
___scope___.file("collections/BulletManager.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BulletManager {
    constructor() {
        this.objectsCollide = true;
        this.bullets = [];
    }
    [Symbol.iterator]() {
        return this.bullets[Symbol.iterator]();
    }
    add(bullet) {
        this.bullets.push(bullet);
        bullet.destroyEmitter.subscribe(() => {
            this.bullets = this.bullets.filter(b => b !== bullet);
        });
    }
}
exports.default = BulletManager;
//# sourceMappingURL=BulletManager.js.map
});
___scope___.file("collections/UnitManager.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("@ma2ciek/events");
const Soldier_1 = require("../models/Soldier");
const Tank_1 = require("../models/Tank");
class UnitManager {
    constructor() {
        this.bulletEmitter = new events_1.Emitter();
        this.objectsCollide = true;
        this.units = [];
    }
    [Symbol.iterator]() {
        return this.units[Symbol.iterator]();
    }
    create(options) {
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
    getInstance(options) {
        switch (options.type) {
            case 'soldier':
                return new Soldier_1.default(options);
            case 'tank':
                return new Tank_1.default(options);
            default:
                throw new Error('not implemented for ' + options.type);
        }
    }
}
exports.default = UnitManager;
//# sourceMappingURL=UnitManager.js.map
});
___scope___.file("models/Soldier.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = require("@ma2ciek/canvas/src/Sprite");
const events_1 = require("@ma2ciek/events");
const math_1 = require("@ma2ciek/math");
const TimeController_1 = require("../utils/TimeController");
const Bullet_1 = require("./Bullet");
const URL = '../images/soldier/handgun/';
class Soldier {
    constructor({ position, player }) {
        this.bulletEmitter = new events_1.Emitter();
        this.deathEmitter = new events_1.Emitter();
        this.radius = 30;
        this.type = 'soldier';
        this.handgunSprites = {
            move: new Sprite_1.default({
                url: URL + 'move.png', frameDuration: 50,
                numberOfFrames: 20, zoom: 0.25,
            }),
            idle: new Sprite_1.default({
                url: URL + 'idle.png', frameDuration: 50,
                numberOfFrames: 20, zoom: 0.25,
            }),
            distanceAttack: new Sprite_1.default({
                url: URL + 'distanceAttack.png', frameDuration: 50,
                numberOfFrames: 3, zoom: 0.25, once: true,
            }),
            meleeAttack: new Sprite_1.default({
                url: URL + 'meleeAttack.png', frameDuration: 50,
                numberOfFrames: 10, zoom: 0.25,
            }),
            reload: new Sprite_1.default({
                url: URL + 'reload.png', frameDuration: 50,
                numberOfFrames: 15, zoom: 0.25, once: true,
            }),
        };
        // TODO: Make it configurable
        this.hp = 100;
        this.ammo = 6;
        this.magazineSize = 6;
        this.speed = 2;
        this.bulletSpeed = 10;
        this.angle = 0;
        this.shotTimeController = new TimeController_1.default(1000);
        this.bulletDamage = 10;
        this.bulletRadius = 3;
        this.currentSprite = this.handgunSprites.idle;
        this.position = position;
        this.player = player;
    }
    draw(ctx) {
        this.currentSprite.draw(ctx, this.position, this.angle);
    }
    track(iterable) {
        this.trackedObjects = iterable;
    }
    handleHit(object) {
        if (object.type !== 'bullet' || object.owner === this) {
            return;
        }
        this.hp -= object.damage;
        if (this.hp <= 0) {
            this.deathEmitter.emit({});
        }
    }
    getShotTimeController() {
        return this.shotTimeController;
    }
    move() {
        this.player.move(this);
    }
    // TODO: move to AI.
    findBestOpponent() {
        const opponents = Array.from(this.trackedObjects).filter(obj => obj !== this);
        let bestOpponent = opponents[0];
        if (!bestOpponent) {
            return;
        }
        let bestDistance = math_1.Vector.squaredDistance(opponents[0].position, this.position);
        for (const opponent of opponents.slice(1)) {
            const distance = math_1.Vector.squaredDistance(opponent.position, this.position);
            if (distance < bestDistance) {
                bestOpponent = opponent;
                bestDistance = distance;
            }
        }
        return bestOpponent;
    }
    hasToReload() {
        return this.ammo === 0;
    }
    reload() {
        this.ammo = this.magazineSize;
        this.setSprite(this.handgunSprites.reload);
    }
    shot(object) {
        this.setSprite(this.handgunSprites.distanceAttack);
        this.ammo--;
        const velocity = math_1.Vector.toSize(math_1.Vector.fromDiff(this.position, object.position), this.bulletSpeed);
        const translation = math_1.Vector.toSize(velocity, 40);
        const spriteShotModifier = math_1.Vector.add(translation, { x: -translation.y * 0.4, y: translation.x * 0.4 });
        const startPosition = math_1.Vector.add(this.position, spriteShotModifier);
        const bullet = new Bullet_1.default({
            position: startPosition,
            velocity,
            owner: this,
            damage: this.bulletDamage,
            radius: this.bulletRadius,
        });
        this.bulletEmitter.emit(bullet);
    }
    setSprite(sprite) {
        if (this.currentSprite === sprite) {
            return;
        }
        this.currentSprite = sprite;
        this.currentSprite.reset();
    }
    getSpeed() {
        return this.speed;
    }
    getCurrentSprite() {
        return this.currentSprite;
    }
    setAngle(angle) {
        this.angle = angle;
    }
}
exports.default = Soldier;
//# sourceMappingURL=Soldier.js.map
});
___scope___.file("utils/TimeController.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeController {
    constructor(debounceTime) {
        this.lastTimestamp = 0;
        this.debounceTime = 0;
        this.debounceTime = debounceTime;
    }
    can() {
        const available = Date.now() > this.debounceTime + this.lastTimestamp;
        if (available) {
            this.lastTimestamp = Date.now();
        }
        return available;
    }
}
exports.default = TimeController;
//# sourceMappingURL=TimeController.js.map
});
___scope___.file("models/Bullet.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("@ma2ciek/canvas");
const events_1 = require("@ma2ciek/events");
class Bullet {
    constructor(options) {
        this.options = options;
        this.destroyEmitter = new events_1.Emitter();
        this.type = 'bullet';
    }
    get position() {
        return this.options.position;
    }
    get radius() {
        return this.options.radius;
    }
    get damage() {
        return this.options.damage;
    }
    draw(ctx, options) {
        if (this.position.x < options.center.x - options.width / 2 ||
            this.position.x > options.center.x + options.width / 2 ||
            this.position.y < options.center.y - options.height / 2 ||
            this.position.y > options.center.y + options.height / 2) {
            this.handleHit();
            return;
        }
        canvas_1.drawArc(ctx, this.position.x, this.position.y, this.radius, 'black');
    }
    move() {
        this.position.x += this.options.velocity.x;
        this.position.y += this.options.velocity.y;
    }
    handleHit() {
        this.destroyEmitter.emit(this);
    }
}
exports.default = Bullet;
//# sourceMappingURL=Bullet.js.map
});
___scope___.file("models/Tank.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("@ma2ciek/canvas");
const Emitter_1 = require("@ma2ciek/events/src/Emitter");
const loadImage_1 = require("@ma2ciek/loaders/src/loadImage");
const normalizeAngle_1 = require("@ma2ciek/math/src/normalizeAngle");
const Vector_1 = require("@ma2ciek/math/src/Vector");
const TimeController_1 = require("../utils/TimeController");
const Bullet_1 = require("./Bullet");
class Tank {
    constructor(options) {
        this.bulletEmitter = new Emitter_1.default();
        this.deathEmitter = new Emitter_1.default();
        this.type = 'tank';
        this.radius = 40;
        this.gunAngle = Math.atan2(0, 0);
        this.tankAngle = Math.atan2(0, 0);
        this.model = options.model;
        this.hp = options.model.hp;
        this.maxHp = options.model.hp;
        this.shotTimeController = new TimeController_1.default(1000);
        this.player = options.player;
        this.position = options.position;
        loadImage_1.default(this.model.url)
            .then(image => {
            this.originalTankImage = image;
            this.image = canvas_1.Layer.fromImage(image).colorize(options.player.getHue(), 0.1);
        });
    }
    draw(ctx) {
        if (!this.originalTankImage) {
            return;
        }
        this.drawTank(ctx);
        this.drawGun(ctx);
        this.drawTankInfo(ctx);
    }
    handleHit(object) {
        if (object.type !== 'bullet' || object.owner === this) {
            return;
        }
        this.hp -= object.damage;
        if (this.hp <= 0) {
            this.deathEmitter.emit({});
        }
    }
    move() {
        let moveVector = this.player.getMoveVector();
        let gunVector = this.player.getGunVector();
        if (this.player.isSpeedButtonPressed()) {
            moveVector = Vector_1.default.times(moveVector, 2);
            gunVector = Vector_1.default.times(gunVector, 2);
        }
        const gunAngle = Vector_1.default.toAngle(gunVector);
        const multiplier = Vector_1.default.getSize(gunVector);
        this.moveTank(moveVector);
        this.rotateGun(gunAngle, multiplier);
        this.maybeShot();
    }
    moveTank(moveVector) {
        const moveAngle = Vector_1.default.toAngle(moveVector);
        const absMoveForce = Math.abs(Math.cos(moveAngle - this.tankAngle) * this.model.tankSpeed);
        const newMoveVector = Vector_1.default.times(moveVector, absMoveForce);
        if (moveVector.x !== 0 || moveVector.y !== 0) {
            this.rotateTank(moveAngle, Vector_1.default.getSize(moveVector));
        }
        this.position = Vector_1.default.add(this.position, newMoveVector);
        if (this.position.x > 3000) {
            this.position.x = 3000;
        }
        if (this.position.x < -3000) {
            this.position.x = -3000;
        }
        if (this.position.y > 3000) {
            this.position.y = 3000;
        }
        if (this.position.y < -3000) {
            this.position.y = -3000;
        }
    }
    rotateTank(angle, multiplier) {
        const angleDiff = Math.abs(this.tankAngle - angle);
        const movement = Math.min(this.model.tankRotationSpeed * multiplier, angleDiff);
        if ((this.tankAngle - angle > 0 && this.tankAngle - angle < Math.PI) ||
            this.tankAngle - angle < -Math.PI) {
            this.tankAngle -= movement;
        }
        else {
            this.tankAngle += movement;
        }
        this.tankAngle = normalizeAngle_1.default(this.tankAngle);
    }
    rotateGun(gunAngle, multiplier) {
        const movement = Math.min(this.model.gunRotationSpeed * multiplier, Math.abs(this.gunAngle - gunAngle));
        if ((this.gunAngle - gunAngle > 0 && this.gunAngle - gunAngle < Math.PI) ||
            this.gunAngle - gunAngle < -Math.PI) {
            this.gunAngle -= movement;
        }
        else {
            this.gunAngle += movement;
        }
        this.gunAngle = normalizeAngle_1.default(this.gunAngle);
    }
    getBulletSpeed() {
        return this.model.bulletSpeed;
    }
    getPosition() {
        return this.position;
    }
    getGunSize() {
        return this.model.gunSize;
    }
    getBulletDamage() {
        return this.model.bulletDamage;
    }
    getBulletRadius() {
        return this.model.bulletRadius;
    }
    maybeShot() {
        if (!this.player.isShooting() || !this.shotTimeController.can()) {
            return;
        }
        const gunVector = Vector_1.default.fromAngle(this.gunAngle, this.getBulletSpeed());
        const startPosition = Vector_1.default.add(this.getPosition(), Vector_1.default.toSize(gunVector, this.getGunSize()));
        const bullet = new Bullet_1.default({
            position: startPosition,
            velocity: gunVector,
            owner: this,
            damage: this.getBulletDamage(),
            radius: this.getBulletRadius(),
        });
        this.bulletEmitter.emit(bullet);
    }
    drawTank(ctx) {
        canvas_1.drawImage({
            ctx,
            image: this.image.getCanvas(),
            x: this.model.tank.x,
            y: this.model.tank.y,
            width: this.model.tank.width,
            height: this.model.tank.height,
            canvasOffsetX: this.position.x,
            canvasOffsetY: this.position.y,
            angle: this.tankAngle,
            center: this.model.tankCenter,
        });
        if (window.debugMode) {
            canvas_1.drawRect({
                ctx,
                x: this.position.x,
                y: this.position.y,
                width: this.model.tank.width,
                height: this.model.tank.height,
                strokeStyle: 'red',
                strokeWidth: 1,
            });
        }
    }
    drawGun(ctx) {
        canvas_1.drawImage({
            ctx,
            image: this.originalTankImage,
            x: this.model.gun.x,
            y: this.model.gun.y,
            width: this.model.gun.width,
            height: this.model.gun.height,
            canvasOffsetX: this.position.x,
            canvasOffsetY: this.position.y,
            angle: this.gunAngle,
            center: this.model.gunCenter,
        });
        if (window.debugMode) {
            canvas_1.drawRect({
                ctx,
                x: this.position.x,
                y: this.position.y,
                width: this.model.gun.width,
                height: this.model.gun.height,
                strokeStyle: 'blue',
                strokeWidth: 1,
            });
        }
    }
    drawTankInfo(ctx) {
        ctx.fillStyle = 'black';
        const text = Math.floor(this.hp / this.maxHp * 100).toFixed(0) + '%';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '25px Arial';
        ctx.fillText(text, this.position.x, this.position.y);
    }
}
exports.default = Tank;
//# sourceMappingURL=Tank.js.map
});
___scope___.file("engine/Renderer.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Renderer {
    constructor({ scene, ctx, camera }) {
        this.render = () => {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.camera.updateBefore(this.ctx);
            this.scene.update();
            this.scene.render(this.ctx, this.camera.getOptions());
            this.camera.updateAfter(this.ctx);
            this.scene.renderStaticElements(this.ctx, this.camera.getOptions());
            this.animationId = window.requestAnimationFrame(this.render);
        };
        this.scene = scene;
        this.ctx = ctx;
        this.camera = camera;
        this.updateScreen();
        window.onresize = () => this.updateScreen();
    }
    stop() {
        window.cancelAnimationFrame(this.animationId);
    }
    updateScreen() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }
}
exports.default = Renderer;
//# sourceMappingURL=Renderer.js.map
});
___scope___.file("engine/Scene.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CollisionManager_1 = require("./CollisionManager");
class Scene {
    constructor(...iterables) {
        this.collisionManager = new CollisionManager_1.default();
        this.iterables = [];
        this.staticElements = [];
        this.add(...iterables);
    }
    add(...iterables) {
        for (const iterable of iterables) {
            this.iterables.push(iterable);
            if (iterable.objectsCollide) {
                this.collisionManager.add(iterable);
            }
        }
    }
    render(ctx, cameraOptions) {
        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
                element.draw(ctx, cameraOptions);
            }
        }
        ctx.restore();
    }
    update() {
        for (const iterable of this.iterables) {
            for (const element of iterable) {
                element.move();
            }
        }
        this.collisionManager.checkCollisions();
    }
    addStaticElements(...staticElements) {
        this.staticElements.push(...staticElements);
    }
    renderStaticElements(ctx, options) {
        for (const el of this.staticElements) {
            el.draw(ctx, options);
        }
    }
}
exports.default = Scene;
//# sourceMappingURL=Scene.js.map
});
___scope___.file("engine/CollisionManager.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("@ma2ciek/math");
class CollisionManager {
    constructor() {
        this.objectIterators = [];
    }
    add(...objects) {
        this.objectIterators.push(...objects);
    }
    checkCollisions() {
        for (let i = 0; i < this.objectIterators.length; i++) {
            for (let j = 0; j < i; j++) {
                for (const o1 of this.objectIterators[i]) {
                    for (const o2 of this.objectIterators[j]) {
                        const collision = this.checkCollision(o1, o2);
                        if (collision) {
                            o1.handleHit(o2);
                            o2.handleHit(o1);
                        }
                    }
                }
            }
        }
    }
    checkCollision(o1, o2) {
        return Math.pow((o1.radius + o2.radius), 2) > math_1.Vector.squaredDistance(o1.position, o2.position);
    }
}
exports.default = CollisionManager;
//# sourceMappingURL=CollisionManager.js.map
});
___scope___.file("engine/WholeViewCamera.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WholeViewCamera {
    updateBefore(ctx) {
        const options = this.getOptions();
        const ratio = options.ratio;
        ctx.save();
        ctx.scale(ratio, ratio);
        ctx.translate(ctx.canvas.width / 2 / ratio - options.center.x, ctx.canvas.height / 2 / ratio - options.center.y);
    }
    updateAfter(ctx) {
        ctx.restore();
    }
    track(collection) {
        this.collection = collection;
    }
    getOptions() {
        let maxLeft = Infinity;
        let maxRight = -Infinity;
        let maxTop = Infinity;
        let maxBottom = -Infinity;
        for (const { position } of this.collection) {
            maxLeft = Math.min(position.x, maxLeft);
            maxRight = Math.max(position.x, maxRight);
            maxTop = Math.min(position.y, maxTop);
            maxBottom = Math.max(position.y, maxBottom);
        }
        const ratio = Math.min(window.innerWidth / (maxRight - maxLeft + window.innerWidth), window.innerHeight / (maxBottom - maxTop + window.innerHeight));
        return {
            center: {
                x: (maxLeft + maxRight) / 2,
                y: (maxTop + maxBottom) / 2,
            },
            width: window.innerWidth / ratio,
            height: window.innerHeight / ratio,
            ratio,
        };
    }
}
exports.default = WholeViewCamera;
//# sourceMappingURL=WholeViewCamera.js.map
});
___scope___.file("players/HumanTankPlayer.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HumanTankPlayer {
    constructor(controller) {
        this.controller = controller;
    }
    isShooting() {
        return this.controller.isPressed(this.controller.key.SHOT_KEY);
    }
    isSpeedButtonPressed() {
        return this.controller.isPressed(this.controller.key.SPEED_UP);
    }
    getMoveVector() {
        return this.controller.getLeftAxis();
    }
    getGunVector() {
        return this.controller.getRightAxis();
    }
    getHue() {
        return Math.random();
    }
}
exports.default = HumanTankPlayer;
//# sourceMappingURL=HumanTankPlayer.js.map
});
___scope___.file("tank-models/E-100.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const E100 = {
    url: '../images/tanks/E-100_strip2.png',
    tank: { x: 0, y: 0, width: 100, height: 170 },
    gun: { x: 95, y: 10, width: 100, height: 200 },
    tankCenter: { x: 50, y: 85 },
    gunCenter: { x: 145, y: 115 },
    gunSize: 70,
    tankSpeed: 3,
    tankRotationSpeed: Math.PI / 25,
    gunRotationSpeed: Math.PI / 30,
    bulletSpeed: 20,
    shotDuration: 500,
    bulletDamage: 40,
    bulletRadius: 5,
    hp: 100,
};
exports.default = E100;
//# sourceMappingURL=E-100.js.map
});
});
FuseBox.pkg("@ma2ciek/events", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("./src/Emitter");
exports.Emitter = Emitter_1.default;
exports.default = {
    Emitter: Emitter_1.default,
};

});
___scope___.file("src/Emitter.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter = (function () {
    function Emitter() {
        this.watchers = [];
    }
    Emitter.prototype.subscribe = function (fn) {
        this.watchers.push(fn);
    };
    Emitter.prototype.emit = function (value) {
        this.watchers.forEach(function (fn) { return fn(value); });
    };
    return Emitter;
}());
exports.default = Emitter;

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("@ma2ciek/math", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = require("./src/Vector");
exports.Vector = Vector_1.default;
exports.default = {
    Vector: Vector_1.default,
};

});
___scope___.file("src/Vector.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var normalizeAngle_1 = require("./normalizeAngle");
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.copy = function (vector) {
        return new Vector(vector.x, vector.y);
    };
    Vector.add = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    Vector.times = function (v, value) {
        return new Vector(v.x * value, v.y * value);
    };
    Vector.squaredDistance = function (v1, v2) {
        return Math.pow((v1.x - v2.x), 2) + Math.pow((v1.y - v2.y), 2);
    };
    Vector.toSize = function (v, size) {
        var times = size / Math.sqrt(v.x * v.x + v.y * v.y);
        if (!Number.isFinite(times)) {
            times = 0;
        }
        return Vector.times(v, times);
    };
    Vector.getSize = function (v) {
        return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
    };
    Vector.fromAngle = function (angle, radius) {
        return new Vector(Math.cos(angle + Math.PI / 2) * radius, Math.sin(angle + Math.PI / 2) * radius);
    };
    Vector.toAngle = function (v) {
        var angle = Math.atan2(v.y, v.x) - Math.PI / 2;
        return normalizeAngle_1.default(angle);
    };
    Vector.fromDiff = function (from, to) {
        return new Vector(to.x - from.x, to.y - from.y);
    };
    return Vector;
}());
exports.default = Vector;

});
___scope___.file("src/normalizeAngle.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle > Math.PI) {
        angle -= 2 * Math.PI;
    }
    if (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    return angle;
}
exports.default = normalizeAngle;

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("@ma2ciek/canvas", {}, function(___scope___){
___scope___.file("src/Sprite.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loaders_1 = require("@ma2ciek/loaders");
var drawImage_1 = require("./drawImage");
var Sprite = (function () {
    function Sprite(options) {
        var _this = this;
        this.lastTimestamp = 0;
        this.currentFrameIndex = 0;
        this.frameDuration = options.frameDuration;
        this.numberOfFrames = options.numberOfFrames;
        this.zoom = options.zoom || 1;
        this.once = !!options.once;
        loaders_1.loadImage(options.url).then(function (image) {
            _this.image = image;
            _this.frameWidth = image.naturalWidth / options.numberOfFrames;
            _this.frameHeight = image.height;
        });
    }
    Sprite.prototype.reset = function () {
        this.currentFrameIndex = 0;
    };
    Sprite.prototype.hasToFinish = function () {
        return !this.isLastFrame() && this.once;
    };
    Sprite.prototype.isLastFrame = function () {
        return this.currentFrameIndex === this.numberOfFrames - 1;
    };
    Sprite.prototype.draw = function (ctx, position, angle) {
        if (!this.image) {
            return;
        }
        if (Date.now() >= this.lastTimestamp + this.frameDuration) {
            this.nextFrame();
            this.lastTimestamp = Date.now();
        }
        drawImage_1.default({
            ctx: ctx,
            angle: angle,
            width: this.frameWidth,
            height: this.frameHeight,
            canvasOffsetX: position.x,
            canvasOffsetY: position.y,
            image: this.image,
            x: this.frameWidth * this.currentFrameIndex,
            y: 0,
            zoom: this.zoom,
        });
    };
    Sprite.prototype.nextFrame = function () {
        if (!this.isLastFrame() || !this.once) {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.numberOfFrames;
        }
    };
    return Sprite;
}());
exports.default = Sprite;

});
___scope___.file("src/drawImage.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawImage(_a) {
    var ctx = _a.ctx, image = _a.image, x = _a.x, y = _a.y, width = _a.width, height = _a.height, canvasOffsetX = _a.canvasOffsetX, canvasOffsetY = _a.canvasOffsetY, _b = _a.angle, angle = _b === void 0 ? 0 : _b, center = _a.center, _c = _a.zoom, zoom = _c === void 0 ? 1 : _c;
    ctx.save();
    if (!center) {
        center = { x: 0, y: 0 };
    }
    ctx.translate(canvasOffsetX, canvasOffsetY);
    ctx.rotate(angle);
    ctx.drawImage(image, x, y, width, height, -width / 2 * zoom, -height / 2 * zoom, width * zoom, height * zoom);
    ctx.restore();
}
exports.default = drawImage;

});
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sprite_1 = require("./src/Sprite");
exports.Sprite = Sprite_1.default;
var drawRect_1 = require("./src/drawRect");
exports.drawRect = drawRect_1.default;
var drawImage_1 = require("./src/drawImage");
exports.drawImage = drawImage_1.default;
var drawArc_1 = require("./src/drawArc");
exports.drawArc = drawArc_1.default;
var Layer_1 = require("./src/Layer");
exports.Layer = Layer_1.default;
exports.default = {
    Sprite: Sprite_1.default,
    drawRect: drawRect_1.default,
    drawImage: drawImage_1.default,
    drawArc: drawArc_1.default,
    Layer: Layer_1.default,
};

});
___scope___.file("src/drawRect.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawRect(_a) {
    var ctx = _a.ctx, x = _a.x, y = _a.y, width = _a.width, height = _a.height, strokeStyle = _a.strokeStyle, strokeWidth = _a.strokeWidth;
    if (strokeStyle && strokeWidth) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(x, y, width, height);
    }
}
exports.default = drawRect;

});
___scope___.file("src/drawArc.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawArc(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}
exports.default = drawArc;

});
___scope___.file("src/Layer.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Layer = (function () {
    function Layer() {
        var canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
    }
    Layer.fromImage = function (image) {
        return new Layer()
            .setSize(image.width, image.height)
            .drawImage(image);
    };
    Layer.prototype.drawImage = function (image) {
        this.ctx.drawImage(image, 0, 0);
        return this;
    };
    Layer.prototype.setSize = function (width, height) {
        var canvas = this.ctx.canvas;
        canvas.width = width;
        canvas.height = height;
        return this;
    };
    Layer.prototype.colorize = function (hue, intensity) {
        return this;
    };
    Layer.prototype.getCanvas = function () {
        return this.ctx.canvas;
    };
    return Layer;
}());
exports.default = Layer;

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("@ma2ciek/loaders", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loadImage_1 = require("./src/loadImage");
exports.loadImage = loadImage_1.default;
exports.default = {
    loadImage: loadImage_1.default,
};

});
___scope___.file("src/loadImage.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadImage(url) {
    return new Promise(function (res, rej) {
        var image = new Image();
        image.onload = function () { return res(image); };
        image.onerror = rej;
        image.onabort = rej;
        image.src = url;
    });
}
exports.default = loadImage;

});
return ___scope___.entry = "index.js";
});

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=h[a];if(!s){if(d)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:c,validPath:v}}function s(e,r){if(!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");var n=new XMLHttpRequest;n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var i=n.getResponseHeader("Content-Type"),o=n.responseText;/json/.test(i)?o="module.exports = "+o:/javascript/.test(i)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);g.dynamic(a,o),r(g.import(e,{}))}else console.error(e,"not found on request"),r(void 0)},n.open("GET",e,!0),n.send()}function l(e,r){var n=m[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=h[t.pkgName];if(f){var p={};for(var m in f.f)a.test(m)&&(p[m]=c(t.pkgName+"/"+m));return p}}if(!i){var g="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return g?r(e):null})}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return c(e,{pkg:_,path:y,v:t.versions})},w.require.main={filename:d?"./":v.require.main.filename,paths:d?[]:v.require.main.paths};var b=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",b),i.fn.apply(0,b),l("after-import",b),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var h=p.p=p.p||{},m=p.e=p.e||{},g=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){m[e]=m[e]||[],m[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=h[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=h.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(h[e])return n(h[e].s);var t=h[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r}();return g.packages=h,g.isBrowser=void 0!==d,g.isServer=!d,g.plugins=[],e.FuseBox=g}(this))
//# sourceMappingURL=dist.js.map