var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Obrez;
(function (Obrez) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = this;
            // Config for the game
            var config = {
                type: Phaser.WEBGL,
                width: 960,
                height: 540,
                parent: 'game-div',
                pixelArt: true,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: false,
                        debugShowBody: true,
                        debugShowStaticBody: true
                    }
                },
                scene: [GameScene.MainMenu, GameScene.Tutorial]
            };
            // Init using config
            _this = _super.call(this, config) || this;
            _this.scene.start("TutorialScene");
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Obrez.Game = Game;
})(Obrez || (Obrez = {}));
var Obrez;
(function (Obrez) {
    Obrez.game = null;
})(Obrez || (Obrez = {}));
function startGame() {
    var game = new Obrez.Game;
    Obrez.game = game;
}
window.onload = startGame;
// Class which serves as base for all scenes
// Contains common methods and properties for all scenes
var GameScene;
(function (GameScene) {
    var SceneBase = /** @class */ (function (_super) {
        __extends(SceneBase, _super);
        function SceneBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SceneBase.prototype, "gameWidth", {
            get: function () {
                return this.sys.game.config.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneBase.prototype, "gameHeight", {
            get: function () {
                return this.sys.game.config.height;
            },
            enumerable: false,
            configurable: true
        });
        return SceneBase;
    }(Phaser.Scene));
    GameScene.SceneBase = SceneBase;
})(GameScene || (GameScene = {}));
///<reference path = "SceneBase.ts" />
var GameScene;
(function (GameScene) {
    var MainMenu = /** @class */ (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MainMenu;
    }(GameScene.SceneBase));
    GameScene.MainMenu = MainMenu;
})(GameScene || (GameScene = {}));
///<reference path = "SceneBase.ts" />
var GameScene;
(function (GameScene) {
    var Tutorial = /** @class */ (function (_super) {
        __extends(Tutorial, _super);
        function Tutorial() {
            return _super.call(this, "TutorialScene") || this;
        }
        Tutorial.prototype.preload = function () {
            // Load audio
            this.load.path = Constants.AUDIO_ASSET_PATH;
            this.load.audio(Constants.UNLOCK_TAG, Constants.AUDIO_UNLOCK_SFX);
            this.load.audio(Constants.OPEN_TAG, Constants.AUDIO_OPEN_SFX);
            this.load.audio(Constants.CLOSE_TAG, Constants.AUDIO_CLOSE_SFX);
            this.load.audio(Constants.LOCK_TAG, Constants.AUDIO_LOCK_SFX);
            this.load.audio(Constants.FIRE_TAG, Constants.AUDIO_FIRE_SFX);
            // Load sprites
            this.load.path = Constants.SPRITE_ASSET_PATH;
            this.load.aseprite(Constants.TUTORIAL_GUN_TAG, Constants.TUTORIAL_GUN_IMG_FILE, Constants.TUTORIAL_GUN_JSON_FILE);
        };
        Tutorial.prototype.create = function () {
            var tags = this.anims.createFromAseprite(Constants.TUTORIAL_GUN_TAG);
            var gun_sprite = this.add.sprite(this.gameWidth / 2, this.gameHeight / 2, Constants.TUTORIAL_GUN_TAG);
            this.sound.add(Constants.UNLOCK_TAG);
            this.sound.add(Constants.OPEN_TAG);
            this.sound.add(Constants.CLOSE_TAG);
            this.sound.add(Constants.LOCK_TAG);
            this.sound.add(Constants.FIRE_TAG);
            var gun_object = new Util.BoltGun(gun_sprite, this.sound);
            this.input.keyboard.on('keydown', function (event) {
                console.log(gun_object);
                gun_object.HandleKeyEvent(event.key.toUpperCase());
            });
            this.cameras.main.backgroundColor = Phaser.Display.Color.ValueToColor(0x808080);
        };
        Tutorial.prototype.update = function () {
        };
        return Tutorial;
    }(GameScene.SceneBase));
    GameScene.Tutorial = Tutorial;
})(GameScene || (GameScene = {}));
var Util;
(function (Util) {
    var BoltGun = /** @class */ (function () {
        function BoltGun(sprite, soundManager) {
            this.rounds = 0;
            this.maxRounds = 5;
            this.emptyRoundInChamber = false;
            this.state = BoltState.Locked;
            this.sprite = sprite;
            this.sprite.setScale(2, 2);
            this.soundManager = soundManager;
        }
        BoltGun.prototype.HandleKeyEvent = function (key) {
            if (this.sprite.anims.isPlaying) {
                return false;
            }
            switch (key) {
                case Global.UNLOCK_KEY:
                    return this.TryUnlock();
                case Global.OPEN_KEY:
                    return this.TryOpen();
                case Global.LOAD_KEY:
                    return this.TryLoad();
                case Global.CLOSE_KEY:
                    return this.TryClose();
                case Global.LOCK_KEY:
                    return this.TryLock();
                case Global.FIRE_KEY:
                    return this.TryFire();
            }
            return true;
        };
        BoltGun.prototype.TryUnlock = function () {
            if (this.state != BoltState.Locked) {
                return false;
            }
            this.state = BoltState.Unlocked;
            this.sprite.play(Constants.UNLOCK_TAG);
            this.soundManager.play(Constants.UNLOCK_TAG);
            return true;
        };
        BoltGun.prototype.TryOpen = function () {
            if (this.state != BoltState.Unlocked) {
                return false;
            }
            this.state = BoltState.Open;
            this.emptyRoundInChamber = false;
            this.sprite.play(Constants.OPEN_TAG);
            this.soundManager.play(Constants.OPEN_TAG);
            if (this.rounds > 0) {
                this.rounds -= 1;
            }
            return true;
        };
        BoltGun.prototype.TryLoad = function () {
            if (this.state != BoltState.Open) {
                return false;
            }
            if (this.rounds >= this.maxRounds) {
                return false;
            }
            this.rounds += 1;
            this.sprite.play(Constants.LOAD_TAG);
            this.soundManager.play(Constants.LOAD_TAG);
            return true;
        };
        BoltGun.prototype.TryClose = function () {
            if (this.state != BoltState.Open) {
                return false;
            }
            this.state = BoltState.Unlocked;
            this.sprite.play(Constants.CLOSE_TAG);
            this.soundManager.play(Constants.CLOSE_TAG);
            return true;
        };
        BoltGun.prototype.TryLock = function () {
            if (this.state != BoltState.Unlocked) {
                return false;
            }
            this.state = BoltState.Locked;
            this.sprite.play(Constants.LOCK_TAG);
            this.soundManager.play(Constants.LOCK_TAG);
            return true;
        };
        BoltGun.prototype.TryFire = function () {
            if (this.state != BoltState.Locked) {
                return false;
            }
            if (this.emptyRoundInChamber) {
                return false;
            }
            if (this.rounds < 1) {
                return false;
            }
            this.emptyRoundInChamber = true;
            this.sprite.play(Constants.FIRE_TAG);
            this.soundManager.play(Constants.FIRE_TAG);
            return true;
        };
        return BoltGun;
    }());
    Util.BoltGun = BoltGun;
    var BoltState;
    (function (BoltState) {
        BoltState[BoltState["Locked"] = 0] = "Locked";
        BoltState[BoltState["Unlocked"] = 1] = "Unlocked";
        BoltState[BoltState["Open"] = 2] = "Open";
    })(BoltState || (BoltState = {}));
})(Util || (Util = {}));
var Constants;
(function (Constants) {
    Constants.DEFAULT_UNLOCK_KEY = '1';
    Constants.DEFAULT_OPEN_KEY = '2';
    Constants.DEFAULT_LOAD_KEY = 'R';
    Constants.DEFAULT_CLOSE_KEY = '3';
    Constants.DEFAULT_LOCK_KEY = '4';
    Constants.DEFAULT_FIRE_KEY = 'F';
    Constants.DEFAULT_LEFT_KEY = 'A';
    Constants.DEFAULT_RIGHT_KEY = 'D';
    Constants.DEFAULT_INTERACT_KEY = 'W';
    Constants.AUDIO_ASSET_PATH = 'assets/audio/';
    Constants.UNLOCK_TAG = 'Unlock';
    Constants.OPEN_TAG = 'Open';
    Constants.LOAD_TAG = 'Load';
    Constants.CLOSE_TAG = 'Close';
    Constants.LOCK_TAG = 'Lock';
    Constants.FIRE_TAG = 'Fire';
    Constants.AUDIO_UNLOCK_SFX = Constants.UNLOCK_TAG + '.wav';
    Constants.AUDIO_OPEN_SFX = Constants.OPEN_TAG + '.wav';
    Constants.AUDIO_CLOSE_SFX = Constants.CLOSE_TAG + '.wav';
    Constants.AUDIO_LOCK_SFX = Constants.LOCK_TAG + '.wav';
    Constants.AUDIO_FIRE_SFX = Constants.FIRE_TAG + '.wav';
    Constants.SPRITE_ASSET_PATH = 'assets/sprites/';
    Constants.TUTORIAL_GUN_TAG = 'JuicedRifleAnimations';
    Constants.TUTORIAL_GUN_IMG_FILE = Constants.TUTORIAL_GUN_TAG + '.png';
    Constants.TUTORIAL_GUN_JSON_FILE = Constants.TUTORIAL_GUN_TAG + '.json';
})(Constants || (Constants = {}));
var Global;
(function (Global) {
    Global.UNLOCK_KEY = Constants.DEFAULT_UNLOCK_KEY;
    Global.OPEN_KEY = Constants.DEFAULT_OPEN_KEY;
    Global.LOAD_KEY = Constants.DEFAULT_LOAD_KEY;
    Global.CLOSE_KEY = Constants.DEFAULT_CLOSE_KEY;
    Global.LOCK_KEY = Constants.DEFAULT_LOCK_KEY;
    Global.FIRE_KEY = Constants.DEFAULT_FIRE_KEY;
    Global.LEFT_KEY = Constants.DEFAULT_LEFT_KEY;
    Global.RIGHT_KEY = Constants.DEFAULT_RIGHT_KEY;
    Global.INTERACT_KEY = Constants.DEFAULT_INTERACT_KEY;
})(Global || (Global = {}));
//# sourceMappingURL=obrez.js.map