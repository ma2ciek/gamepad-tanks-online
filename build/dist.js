(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("game.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BulletManager_1 = require("./BulletManager");
const PlayerManager_1 = require("./PlayerManager");
// import CollisionManager from './CollisionManager';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const playerManager = new PlayerManager_1.default();
const bulletManager = new BulletManager_1.default();
// const collisionManager = new CollisionManager();
playerManager.bulletEmitter.subscribe(bullet => bulletManager.add(bullet));
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playerManager.updatePads();
    for (const player of playerManager.getPlayers()) {
        player.move();
        player.draw(ctx);
    }
    for (const bullet of bulletManager.getBullets()) {
        bullet.move();
        bullet.draw(ctx);
    }
    // for (const bullet of bulletManager.getBullets()) {
    //     for (const player of playerManager.getPlayers()) {
    //         const collision = collisionManager.checkCollisions(bullet, player);
    //         if (collision) {
    //             player.handleHit(bullet);
    //         }
    //     }
    // }
    requestAnimationFrame(loop);
}
function updateScreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = updateScreen;
updateScreen();
loop();
//# sourceMappingURL=game.js.map
});
___scope___.file("BulletManager.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BulletManager {
    constructor() {
        this.bullets = [];
    }
    getBullets() {
        return this.bullets;
    }
    add(bullet) {
        this.bullets.push(bullet);
    }
}
exports.default = BulletManager;
//# sourceMappingURL=BulletManager.js.map
});
___scope___.file("PlayerManager.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = require("./Emitter");
const Player_1 = require("./Player");
class PlayerManager {
    constructor() {
        this.bulletEmitter = new Emitter_1.default();
        this.players = [];
    }
    updatePads() {
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
    getPlayers() {
        return this.players;
    }
    createPlayer(pad) {
        const player = new Player_1.default();
        this.players[pad.index] = player;
        player.shotEmitter.subscribe(bullet => {
            this.bulletEmitter.emit(bullet);
        });
        player.deathEmitter.subscribe(() => {
            this.players = this.players.filter(p => p !== player);
        });
    }
}
exports.default = PlayerManager;
//# sourceMappingURL=PlayerManager.js.map
});
___scope___.file("Emitter.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emitter {
    constructor() {
        this.watchers = [];
    }
    subscribe(fn) {
        this.watchers.push(fn);
    }
    emit(value) {
        this.watchers.forEach(fn => fn(value));
    }
}
exports.default = Emitter;
//# sourceMappingURL=Emitter.js.map
});
___scope___.file("Player.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bullet_1 = require("./Bullet");
const Emitter_1 = require("./Emitter");
const Tank_1 = require("./Tank");
const E_100_1 = require("./tanks/E-100");
const Vector_1 = require("./Vector");
const colors = [
    'green',
    'red',
    'blue',
];
class Player {
    constructor() {
        this.shotEmitter = new Emitter_1.default();
        this.deathEmitter = new Emitter_1.default();
        this.hp = 100;
        this.kills = 0;
        this.deaths = 0;
        this.lastShotTimestamp = Date.now();
        this.tank = new Tank_1.default(E_100_1.default);
    }
    update(pad) {
        this.pad = pad;
        this.color = colors[this.pad.index];
        const clickedButtons = this.pad.buttons.map(b => b.pressed);
        clickedButtons.forEach((buttonClicked, i) => {
            if (clickedButtons[i]) {
                if (i === 5) {
                    this.maybeShot();
                }
            }
        });
    }
    move() {
        let moveVector = new Vector_1.default(this.pad.axes[0], this.pad.axes[1]);
        if (this.pad.buttons[7].pressed) {
            moveVector = Vector_1.default.times(moveVector, 2);
        }
        this.tank.move(moveVector);
        if (this.pad.axes[2] !== 0 && this.pad.axes[3] !== 0) {
            const gunAngle = Vector_1.default.toAngle(new Vector_1.default(this.pad.axes[2], this.pad.axes[3]));
            this.tank.rotateGun(gunAngle);
        }
    }
    draw(ctx) {
        this.tank.draw(ctx);
    }
    handleHit(bullet) {
        if (bullet.owner === this) {
            return;
        }
        this.hp -= 10;
        if (this.hp <= 0) {
            this.deathEmitter.emit({});
        }
    }
    maybeShot() {
        if (this.lastShotTimestamp + this.tank.getShotFrequency() > Date.now()) {
            return;
        }
        const gunVector = Vector_1.default.fromAngle(this.tank.getGunAngle(), this.tank.getBulletSpeed());
        const startPosition = Vector_1.default.add(this.tank.getPosition(), Vector_1.default.toSize(gunVector, this.tank.getGunSize()));
        const bullet = new Bullet_1.default(startPosition, gunVector, this);
        this.lastShotTimestamp = Date.now();
        this.shotEmitter.emit(bullet);
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map
});
___scope___.file("Bullet.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Bullet {
    constructor(position, velocity, owner) {
        this.position = position;
        this.velocity = velocity;
        this.owner = owner;
        this.radius = 3;
    }
    draw(ctx) {
        utils_1.drawArc(ctx, this.position.x, this.position.y, this.radius, 'black');
    }
    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
exports.default = Bullet;
//# sourceMappingURL=Bullet.js.map
});
___scope___.file("utils.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawArc(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}
exports.drawArc = drawArc;
function drawImage({ ctx, image, x, y, width, height, canvasOffsetX, canvasOffsetY, angle = 0, center, }) {
    ctx.save();
    if (!center) {
        center = { x: 0, y: 0 };
    }
    ctx.translate(canvasOffsetX, canvasOffsetY);
    ctx.rotate(angle);
    ctx.drawImage(image, x, y, width, height, -width / 2, -height / 2, width, height);
    ctx.restore();
}
exports.drawImage = drawImage;
function loadImage(url) {
    return new Promise((res, rej) => {
        const image = new Image();
        image.onload = () => res(image);
        image.onerror = rej;
        image.onabort = rej;
        image.src = url;
    });
}
exports.loadImage = loadImage;
function createArray(size, filler) {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = filler;
    }
    return arr;
}
exports.createArray = createArray;
function drawRect({ ctx, x, y, width, height, strokeStyle, strokeWidth }) {
    if (strokeStyle && strokeWidth) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(x, y, width, height);
    }
}
exports.drawRect = drawRect;
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
exports.normalizeAngle = normalizeAngle;
//# sourceMappingURL=utils.js.map
});
___scope___.file("Tank.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const Vector_1 = require("./Vector");
class Tank {
    constructor(model) {
        this.gunAngle = Math.atan2(0, 0);
        this.tankAngle = Math.atan2(0, 0);
        this.position = new Vector_1.default(Math.random() * 100, Math.random() * 100);
        this.model = model;
        window.gunRect = model.gun;
        window.gunCenter = model.gunCenter;
        utils_1.loadImage(model.imgUrl).then(image => this.image = image);
    }
    draw(ctx) {
        if (!this.image) {
            return;
        }
        this.drawTank(ctx);
        this.drawGun(ctx);
    }
    move(moveVector) {
        const moveAngle = Vector_1.default.toAngle(moveVector);
        const multiplier = Math.abs(Math.cos(moveAngle - this.tankAngle) * this.model.tankSpeed);
        moveVector = Vector_1.default.times(moveVector, multiplier);
        if (moveVector.x !== 0 || moveVector.y !== 0) {
            this.rotateTank(moveAngle);
        }
        this.position = Vector_1.default.add(this.position, moveVector);
    }
    rotateTank(angle) {
        const movement = Math.min(this.model.tankRotationSpeed, Math.abs(this.tankAngle - angle));
        if ((this.tankAngle - angle > 0 && this.tankAngle - angle < Math.PI) ||
            this.tankAngle - angle < -Math.PI) {
            this.tankAngle -= movement;
        }
        else {
            this.tankAngle += movement;
        }
        this.tankAngle = utils_1.normalizeAngle(this.tankAngle);
    }
    rotateGun(gunAngle) {
        const movement = Math.min(this.model.gunRotationSpeed, Math.abs(this.gunAngle - gunAngle));
        if ((this.gunAngle - gunAngle > 0 && this.gunAngle - gunAngle < Math.PI) ||
            this.gunAngle - gunAngle < -Math.PI) {
            this.gunAngle -= movement;
        }
        else {
            this.gunAngle += movement;
        }
        this.gunAngle = utils_1.normalizeAngle(this.gunAngle);
    }
    getGunAngle() {
        return this.gunAngle;
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
    getShotFrequency() {
        return this.model.shotFrequency;
    }
    drawTank(ctx) {
        utils_1.drawImage({
            ctx,
            image: this.image,
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
            utils_1.drawRect({
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
        utils_1.drawImage({
            ctx,
            image: this.image,
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
            utils_1.drawRect({
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
}
exports.default = Tank;
//# sourceMappingURL=Tank.js.map
});
___scope___.file("Vector.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static copy(vector) {
        return new Vector(vector.x, vector.y);
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static times(v, value) {
        return new Vector(v.x * value, v.y * value);
    }
    static squaredDistance(v1, v2) {
        return Math.pow((v1.x - v2.x), 2) + Math.pow((v1.y - v2.y), 2);
    }
    static toSize(v, size) {
        const times = size / Math.sqrt(v.x * v.x + v.y * v.y);
        return Vector.times(v, times);
    }
    static fromAngle(angle, radius) {
        return new Vector(Math.cos(angle + Math.PI / 2) * radius, Math.sin(angle + Math.PI / 2) * radius);
    }
    static toAngle(v) {
        const angle = Math.atan2(v.y, v.x) - Math.PI / 2;
        return utils_1.normalizeAngle(angle);
    }
}
exports.default = Vector;
window.Vector = Vector;
//# sourceMappingURL=Vector.js.map
});
___scope___.file("tanks/E-100.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    imgUrl: '../images/tanks/E-100_strip2.png',
    tank: { x: 0, y: 0, width: 100, height: 170 },
    gun: { x: 95, y: 10, width: 100, height: 200 },
    tankCenter: { x: 50, y: 85 },
    gunCenter: { x: 145, y: 115 },
    gunSize: 70,
    tankSpeed: 5,
    tankRotationSpeed: Math.PI / 20,
    gunRotationSpeed: Math.PI / 30,
    bulletSpeed: 20,
    shotFrequency: 200,
};
//# sourceMappingURL=E-100.js.map
});
});

FuseBox.import("default/game.js");
FuseBox.main("default/game.js");
})
(function(e){if(e.FuseBox)return e.FuseBox;var r="undefined"!=typeof window&&window.navigator;r&&(window.global=window),e=r&&"undefined"==typeof __fbx__dnm__?e:module.exports;var n=r?window.__fsbx__=window.__fsbx__||{}:global.$fsbx=global.$fsbx||{};r||(global.require=require);var t=n.p=n.p||{},i=n.e=n.e||{},a=function(e){var n=e.charCodeAt(0),t=e.charCodeAt(1);if((r||58!==t)&&(n>=97&&n<=122||64===n)){if(64===n){var i=e.split("/"),a=i.splice(2,i.length).join("/");return[i[0]+"/"+i[1],a||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var f=e.substring(0,o),u=e.substring(o+1);return[f,u]}},o=function(e){return e.substring(0,e.lastIndexOf("/"))||"./"},f=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var a=[],t=0,i=n.length;t<i;t++){var o=n[t];o&&"."!==o&&(".."===o?a.pop():a.push(o))}return""===n[0]&&a.unshift(""),a.join("/")||(a.length?"/":".")},u=function(e){var r=e.match(/\.(\w{1,})$/);if(r){var n=r[1];return n?e:e+".js"}return e+".js"},s=function(e){if(r){var n,t=document,i=t.getElementsByTagName("head")[0];/\.css$/.test(e)?(n=t.createElement("link"),n.rel="stylesheet",n.type="text/css",n.href=e):(n=t.createElement("script"),n.type="text/javascript",n.src=e,n.async=!0),i.insertBefore(n,i.firstChild)}},l=function(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])},c=function(e){return{server:require(e)}},v=function(e,n){var i=n.path||"./",o=n.pkg||"default",s=a(e);if(s&&(i="./",o=s[0],n.v&&n.v[o]&&(o=o+"@"+n.v[o]),e=s[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),i="./";else if(!r&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return c(e);var l=t[o];if(!l){if(r)throw'Package was not found "'+o+'"';return c(o+(e?"/"+e:""))}e||(e="./"+l.s.entry);var v,d=f(i,e),p=u(d),g=l.f[p];return!g&&p.indexOf("*")>-1&&(v=p),g||v||(p=f(d,"/","index.js"),g=l.f[p],g||(p=d+".js",g=l.f[p]),g||(g=l.f[d+".jsx"]),g||(p=d+"/index.jsx",g=l.f[p])),{file:g,wildcard:v,pkgName:o,versions:l.v,filePath:d,validPath:p}},d=function(e,n){if(!r)return n(/\.(js|json)$/.test(e)?global.require(e):"");var t;t=new XMLHttpRequest,t.onreadystatechange=function(){if(4==t.readyState)if(200==t.status){var r=t.getResponseHeader("Content-Type"),i=t.responseText;/json/.test(r)?i="module.exports = "+i:/javascript/.test(r)||(i="module.exports = "+JSON.stringify(i));var a=f("./",e);h.dynamic(a,i),n(h.import(e,{}))}else console.error(e+" was not found upon request"),n(void 0)},t.open("GET",e,!0),t.send()},p=function(e,r){var n=i[e];if(n)for(var t in n){var a=n[t].apply(null,r);if(a===!1)return!1}},g=function(e,n){if(void 0===n&&(n={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return s(e);var i=v(e,n);if(i.server)return i.server;var a=i.file;if(i.wildcard){var f=new RegExp(i.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=t[i.pkgName];if(u){var l={};for(var c in u.f)f.test(c)&&(l[c]=g(i.pkgName+"/"+c));return l}}if(!a){var h="function"==typeof n,m=p("async",[e,n]);if(m===!1)return;return d(e,function(e){if(h)return n(e)})}var x=i.validPath,_=i.pkgName;if(a.locals&&a.locals.module)return a.locals.module.exports;var w=a.locals={},y=o(x);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return g(e,{pkg:_,path:y,v:i.versions})},w.require.main={filename:r?"./":global.require.main.filename,paths:r?[]:global.require.main.paths};var b=[w.module.exports,w.require,w.module,x,y,_];p("before-import",b);var j=a.fn;return j.apply(0,b),p("after-import",b),w.module.exports},h=function(){function n(){}return n.global=function(e,n){var t=r?window:global;return void 0===n?t[e]:void(t[e]=n)},n.import=function(e,r){return g(e,r)},n.on=function(e,r){i[e]=i[e]||[],i[e].push(r)},n.exists=function(e){try{var r=v(e,{});return void 0!==r.file}catch(e){return!1}},n.remove=function(e){var r=v(e,{}),n=t[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},n.main=function(e){return this.mainFile=e,n.import(e,{})},n.expose=function(r){var n=function(n){var t=r[n],i=t.alias,a=g(t.pkg);"*"===i?l(a,function(r,n){return e[r]=n}):"object"==typeof i?l(i,function(r,n){return e[n]=a[r]}):e[i]=a};for(var t in r)n(t)},n.dynamic=function(r,n,t){var i=t&&t.pkg||"default";this.pkg(i,{},function(t){t.file(r,function(r,t,i,a,o){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,a,o,e)})})},n.flush=function(e){var r=t.default;for(var n in r.f){var i=!e||e(n);if(i){var a=r.f[n];delete a.locals}}},n.pkg=function(e,r,n){if(t[e])return n(t[e].s);var i=t[e]={},a=i.f={};i.v=r;var o=i.s={file:function(e,r){a[e]={fn:r}}};return n(o)},n.addPlugin=function(e){this.plugins.push(e)},n}();return h.packages=t,h.isBrowser=void 0!==r,h.isServer=!r,h.plugins=[],e.FuseBox=h}(this))
//# sourceMappingURL=sourcemaps.js.map