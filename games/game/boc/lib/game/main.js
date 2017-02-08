ig.module(
    'game.main'
)
    .requires(
    'impact.game',
    'impact.font',
    'game.levels.level2',
    'game.levels.mainMenu',
    'game.levels.controlsMenu',
    'game.levels.highscoreMenu',
    'game.levels.battleMenu',
    'game.entities.police'
    )
    .defines(function () {

        MyGame = ig.Game.extend({

            //Load pictures
            volOnImage: new ig.Image('media/menu/Controls/PNG/TonAn.png'),
            volOffImage: new ig.Image('media/menu/Controls/PNG/TonAus.png'),
            pauseImage: new ig.Image('media/menu/Pause/Pausenmenu.png'),
            splashscreenImage: new ig.Image('media/menu/Splash/Splashscreen.png'),
            gameOverImage: new ig.Image('media/menu/Game Over Screen/Game Over Screen.png'),
            healthImage: new ig.Image('media/health.png'),
            infintyImage: new ig.Image('media/infinity.png'),
            highscoreEmptyImage: new ig.Image('media/menu/Highscore/Highscore3.png'),

            menuSound: new ig.Sound('media/music/Projekt.ogg', false),
            gameSound: new ig.Sound('media/music/Kolega.ogg', false),

            //current game state
            state: 'mainMenu',

            timerTime: 45,

            //true, if game volume should be 0
            volOff: false,

            //points, the character already got (reset on level start)
            points: 0,

            //count down timer
            timer: null,
            newWaveTimer: null,

            //used in the police class (spawning items pseudo randomly)
            spawnCounter: 0,

            //input text (player's name) for gameOverScreen
            playerName: "",

            highscoreList: [],

            resetTimer: true,

            currentLevel: 1,

            shouldShowNewWave: false,

            showCursor: false,
            shouldChangeCursor: false,

            enteredGroupName: "",

            groupNameExists: false,

            groupNotFound: false,

            shouldCreateGroup: false,
            shouldEnterGroup: false,

            cntHelper: 2.5,
            splashScreenCountUp: true,
            showSplashScreenText: false,

            pickedUpAmmo: false,
            pickedUpMedipack: false,

            init: function () {
                this.bindKeysForGame();

                this.reloadHighscore();

                //read volOff value from local storage, create new one if not exists
                if (!localStorage.getItem("volOff")) {
                    localStorage.setItem("volOff", false);
                }

                if (!localStorage.getItem("groupName")) {
                    localStorage.setItem("groupName", "global");
                }

                //set the game volume and load the tracks; start playing menu sound
                ig.music.setVolume(localStorage.getItem("volOff") == 'false' ? 1 : 0);
                ig.music.add(this.menuSound, 'menuSound');
                ig.music.add(this.gameSound, 'gameSound');
                ig.music.loop = true;
                ig.music.play('menuSound');

                //if all resources have been loaded - start the game by loading the main menu
                this.loadLevel(LevelMainMenu);

                this.timer = new ig.Timer(this.timerTime);
                this.timer.pause();
                this.newWaveTimer = new ig.Timer(4);
                this.newWaveTimer.pause();
            },

            update: function () {
                // Update all entities and backgroundMaps
                this.parent();

                if (ig.input.pressed('click'))
                    console.log('Mouse: x = ' + ig.input.mouse.x + ', y = ' + ig.input.mouse.y);

                /*state machine, which has the following states
                    - mainMenu
                    - controlsMenu
                    - highscoreMenu
                    - splashscreen
                    - playing
                    - paused
                    - controlsMenuPause
                    - gameOver
                 */
                switch (this.state) {
                    case 'mainMenu':
                        if (ig.input.pressed('click') && ig.input.mouse.x > 387 && ig.input.mouse.x < 896 && ig.input.mouse.y > 450 && ig.input.mouse.y < 548) {
                            this.state = 'controlsMenu';
                        } else if (ig.input.pressed('click') && ig.input.mouse.x > 387 && ig.input.mouse.x < 896 && ig.input.mouse.y > 287 && ig.input.mouse.y < 383) {

                            //fad out music 3 seconds and show the splash screen 3 seconds; then start the actual game
                            this.state = 'splashscreen';
                            this.bindKeysForGame();

                            setTimeout(() => {
                                this.showSplashScreenText = true;
                            }, 3000);

                            ig.music.fadeOut(2);
                        } else if (ig.input.pressed('click') && ig.input.mouse.x > 387 && ig.input.mouse.x < 896 && ig.input.mouse.y > 606 && ig.input.mouse.y < 704) {
                            this.reloadHighscore().done(() => {
                                this.loadLevel(LevelHighscoreMenu);
                                this.state = 'highscoreMenu';
                            });
                        }

                        break;

                    case 'playing':
                        var player = ig.game.getEntityByName('player');

                        if (!player || this.timer.delta() >= 0) {
                            this.state = 'gameOver';
                            this.bindKeysForKeyboardInput();
                            break;
                        }

                        if (ig.input.pressed('pause')) {
                            this.state = 'paused';
                        }

                        if (this.resetTimer) {
                            this.timer.set(this.timerTime);
                            this.resetTimer = false;
                        }

                        if (this.timer) {
                            this.timer.unpause();
                        }

                        var policeMen = this.getEntitiesByType(EntityPolice);
                        if (policeMen.length == 0) {
                            this.timer.pause();

                            this.shouldShowNewWave = true;
                            this.newWaveTimer.unpause();
                        }

                        this.screen.x = player.pos.x - ig.system.width * 0.5 + player.size.x * 0.5;
                        this.screen.y = player.pos.y - ig.system.height * 0.5 + player.size.y * 0.5;


                        if (this.screen.x < 0) {
                            this.screen.x = 0;
                        }
                        if (this.screen.x > 3200 - 1280) {
                            this.screen.x = 3200 - 1280;
                        }
                        if (this.screen.y < 0) {
                            this.screen.y = 0;
                        }
                        if (this.screen.y > 2000 - 800) {
                            this.screen.y = 2000 - 800;
                        }

                        break;

                    case 'controlsMenu':
                        if (ig.input.pressed('back') || (ig.input.pressed('click') && ig.input.mouse.x > 139 && ig.input.mouse.x < 1168 && ig.input.mouse.y > 83 && ig.input.mouse.y < 213)) {
                            this.loadLevel(LevelMainMenu);
                            this.state = 'mainMenu';
                            this.showSplashScreenText = false;
                        }

                        if (ig.input.pressed('click') && ig.input.mouse.x > 785 && ig.input.mouse.x < 828 && ig.input.mouse.y > 276 && ig.input.mouse.y < 322) {
                            localStorage.setItem("volOff", localStorage.getItem("volOff") != 'true');
                            this.volOff = (localStorage.getItem("volOff") == "true");
                            if (this.volOff == true) {
                                ig.music.setVolume(0);
                            } else {
                                ig.music.setVolume(1);
                            }
                        }
                        break;

                    case 'paused':
                        if (this.timer)
                            this.timer.pause();

                        if (ig.input.pressed('pause') || (ig.input.pressed('click') && ig.input.mouse.x > 675 && ig.input.mouse.x < 1187 && ig.input.mouse.y > 296 && ig.input.mouse.y < 394)) {
                            this.state = 'playing';
                        } else if (ig.input.pressed('back') || (ig.input.pressed('click') && ig.input.mouse.x > 675 && ig.input.mouse.x < 1187 && ig.input.mouse.y > 607 && ig.input.mouse.y < 702)) {
                            this.loadLevel(LevelMainMenu);
                            this.state = 'mainMenu';
                            this.showSplashScreenText = false;
                            ig.music.play('menuSound');
                        } else if (ig.input.pressed('click') && ig.input.mouse.x > 675 && ig.input.mouse.x < 1187 && ig.input.mouse.y > 453 && ig.input.mouse.y < 548) {
                            this.state = 'controlsMenuPause';
                        }
                        break;

                    case 'highscoreMenu':
                        if (ig.input.pressed('back') || (ig.input.pressed('back') || (ig.input.pressed('click') && ig.input.mouse.x > 139 && ig.input.mouse.x < 1168 && ig.input.mouse.y > 50 && ig.input.mouse.y < 180))) {
                            this.loadLevel(LevelMainMenu);
                            this.state = 'mainMenu';
                            this.showSplashScreenText = false;
                        }

                        if ((ig.input.pressed('click') && ig.input.mouse.x > 139 && ig.input.mouse.x < 1160 && ig.input.mouse.y > 665 && ig.input.mouse.y < 765)) {
                            if (localStorage.getItem('groupName') != 'global') {
                                localStorage.setItem('groupName', 'global');
                                this.enteredGroupName = "";
                                this.loadLevel(LevelMainMenu);
                                this.state = 'mainMenu';
                            } else {
                                this.loadLevel(LevelBattleMenu);
                                this.state = 'battleModeMenu';
                                this.bindKeysForKeyboardInput();
                            }
                        }
                        break;

                    case 'controlsMenuPause':
                        if (ig.input.pressed('back') || ((ig.input.pressed('click') && ig.input.mouse.x > 139 && ig.input.mouse.x < 1168 && ig.input.mouse.y > 83 && ig.input.mouse.y < 213))) {
                            this.state = 'paused';
                        }

                        if (ig.input.pressed('click') && ig.input.mouse.x > 785 && ig.input.mouse.x < 828 && ig.input.mouse.y > 276 && ig.input.mouse.y < 322) {
                            localStorage.setItem("volOff", localStorage.getItem("volOff") != 'true');
                            this.volOff = (localStorage.getItem("volOff") == "true");
                            if (this.volOff == true) {
                                ig.music.setVolume(0);
                            } else {
                                ig.music.setVolume(1);
                            }
                        }
                        break;
                    case 'splashscreen':
                        if (ig.input.pressed('shoot') && this.showSplashScreenText) {
                            this.loadLevel(LevelLevel2);
                            this.bindKeysForGame();
                            this.state = 'playing';
                            this.points = 0;
                            ig.music.play('gameSound');
                            this.resetTimer = true;
                        }
                        break;

                    case 'gameOver':
                        /*setTimeout(() => {
                            this.loadLevel(LevelLevel2);
                            this.timer = new ig.Timer(30);
                            this.timer.pause();
                            this.state = 'playing';
                            console.log("game over over");
                            //ig.music.play('gameSound')
                        }, 3000).bind(this);*/

                        var charCodeA = 'A'.charCodeAt(0);

                        for (let i = charCodeA; i <= charCodeA + 26 && this.playerName.length < 14; i++) {
                            if (ig.input.pressed(String.fromCharCode(i))) {
                                this.playerName += String.fromCharCode(i);
                            }
                        }

                        if (ig.input.pressed('backspace')) {
                            this.playerName = this.playerName.substr(0, this.playerName.length - 1);
                        }

                        if ((ig.input.pressed('enter') || (ig.input.pressed('click') && ig.input.mouse.x > 75 && ig.input.mouse.x < 470 && ig.input.mouse.y > 670 && ig.input.mouse.y < 747))) {
                            if (this.playerName != "") {
			        var promise = this.reloadHighscore();
                                promise.done(() => {
                                    this.addNewHighscore(this.playerName, this.points)
                                });
			    }

                            this.playerName = "";
                            this.loadLevel(LevelMainMenu);
                            this.state = 'mainMenu';
                            this.currentLevel = 1;
                            this.timer.set(this.timerTime);
                            this.timer.pause();
                            this.bindKeysForGame();
                            this.points = 0;
                            this.resetTimer = true;
                            ig.music.play('menuSound');
                            this.showSplashScreenText = false;
                        }

                        if (((ig.input.pressed('click') && ig.input.mouse.x > 75 && ig.input.mouse.x < 470 && ig.input.mouse.y > 564 && ig.input.mouse.y < 638)) && (this.playerName != "")) {
                            var promise = this.reloadHighscore();
                            promise.done(() => {
                                this.addNewHighscore(this.playerName, this.points)
                            });

                            this.playerName = "";
                            this.loadLevel(LevelLevel2);
                            this.state = 'playing';
                            this.currentLevel = 1;
                            this.timer.set(this.timerTime);
                            this.timer.pause();
                            this.bindKeysForGame();
                            this.resetTimer = true;
                            this.points = 0;
                        }

                        break;

                    case 'battleModeMenu':
                        if ((ig.input.pressed('back') || (ig.input.pressed('click') && ig.input.mouse.x > 139 && ig.input.mouse.x < 1168 && ig.input.mouse.y > 50 && ig.input.mouse.y < 180))) {
                            this.loadLevel(LevelHighscoreMenu);
                            this.state = 'highscoreMenu';
                            this.bindKeysForGame();
                        }

                        var charCodeA = 'A'.charCodeAt(0);

                        for (let i = charCodeA; i <= charCodeA + 26 && this.enteredGroupName.length < 10; i++) {
                            if (ig.input.pressed(String.fromCharCode(i))) {
                                this.enteredGroupName += String.fromCharCode(i);
                                this.groupNameExists = false;
                                this.groupNotFound = false;
                            }
                        }

                        if (ig.input.pressed('backspace')) {
                            this.enteredGroupName = this.enteredGroupName.substr(0, this.enteredGroupName.length - 1);
                            this.groupNameExists = false;
                            this.groupNotFound = false;
                        }

                        if (ig.input.pressed('click') && ig.input.mouse.x > 140 && ig.input.mouse.x < 590 && ig.input.mouse.y > 460 && ig.input.mouse.y < 560) {
                            console.log('create group clicked');
                            this.reloadHighscore();
                            this.groupNameExists = false;

                            this.shouldEnterGroup = false;
                            this.shouldCreateGroup = true;

                            for (let i = 0; i < this.highscoreList.length; i++) {
                                if (this.highscoreList[i].group == this.enteredGroupName) {
                                    this.groupNameExists = true;
                                }
                            }

                            if (!this.groupNameExists && this.enteredGroupName != "") {
                                localStorage.setItem('groupName', this.enteredGroupName);
                                this.loadLevel(LevelHighscoreMenu);
                                this.state = 'highscoreMenu';
                            }

                        }

                        if (ig.input.pressed('click') && ig.input.mouse.x > 670 && ig.input.mouse.x < 1150 && ig.input.mouse.y > 460 && ig.input.mouse.y < 560 && this.enteredGroupName != "") {
                            console.log('enter group clicked');
                            this.reloadHighscore();
                            this.groupNameExists = false;
                            this.shouldEnterGroup = true;
                            this.shouldCreateGroup = false;

                            for (let i = 0; i < this.highscoreList.length; i++) {
                                if (this.highscoreList[i].group == this.enteredGroupName) {
                                    this.groupNameExists = true;
                                }
                            }

                            if (!this.groupNameExists) {
                                this.groupNotFound = true;
                            } else {
                                if (this.enteredGroupName != "") {
                                    localStorage.setItem('groupName', this.enteredGroupName);
                                    this.loadLevel(LevelHighscoreMenu);
                                    this.state = 'highscoreMenu';
                                }
                            }
                        }



                        break;

                    default:

                        break;
                }

            },

            draw: function () {
                // Draw all entities and backgroundMaps
                this.parent();

                var ctx = ig.system.context;

                if (this.state === 'controlsMenu' || this.state === 'controlsMenuPause') {
                    this.volOff = localStorage.getItem('volOff') == 'true';
                    if (!this.volOff)
                        this.volOnImage.draw(0, 0);
                    else
                        this.volOffImage.draw(0, 0);
                }

                else if (this.state == 'paused') {
                    this.pauseImage.draw(0, 0);

                    var level = this.currentLevel;
                    console.log(level);

                    for (let i = level; i < 14; i++) {
                        ctx.fillStyle = 'rgba(225,0,0,0.1)';
                        ctx.fillRect(100 * ig.system.scale, 240 * ig.system.scale + 37 * ig.system.scale * level, 540 * ig.system.scale, 37 * ig.system.scale * (14 - level));
                    }
                }

                else if (this.state == 'splashscreen') {
                    this.splashscreenImage.draw(0, 0);

                    if (this.splashScreenCountUp) {
                        this.cntHelper += 0.03;
                        if (this.cntHelper >= 3.3) {
                            this.splashScreenCountUp = false;
                        }
                    } else {
                        this.cntHelper -= 0.03;
                        if (this.cntHelper <= 2.5) {
                            this.splashScreenCountUp = true;
                        }
                    }

                    var fontStr = (this.cntHelper * 10).toString() + 'px meine-schrift';

                    ctx.font = fontStr;
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    if (this.showSplashScreenText)
                        ctx.fillText('Press SPACE to continue', 780 * ig.system.scale - this.cntHelper * 25 * ig.system.scale, 735 * ig.system.scale);
                }

                else if (this.state == 'gameOver') {
                    this.gameOverImage.draw(0, 0);

                    ctx.font = '40px meine-schrift';
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillText(this.pad(this.points, 6), 586 * ig.system.scale, 380 * ig.system.scale);
                    var nameToShow = this.playerName;
                    if (this.showCursor) {
                        nameToShow += '|';
                    }
                    ctx.fillText(nameToShow, 586 * ig.system.scale, 500 * ig.system.scale);

                    if (!this.shouldChangeCursor) {
                        this.shouldChangeCursor = true;
                        setTimeout(() => {
                            this.showCursor = !this.showCursor;
                            this.shouldChangeCursor = false;
                        }, 500);
                    }
                }

                else if (this.state == 'playing') {
                    var health = ig.game.getEntityByName('player').health;

                    this.healthImage.draw(20 * ig.system.scale, 22 * ig.system.scale);

                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fillRect(216 * ig.system.scale, 16 * ig.system.scale, 208 * ig.system.scale, 48 * ig.system.scale);
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillRect(220 * ig.system.scale, 20 * ig.system.scale, health * 2 * ig.system.scale, 40 * ig.system.scale);

                    ctx.font = '40px meine-schrift';
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillText(this.pad(this.points, 6), 20 * ig.system.scale, 120 * ig.system.scale);

                    ctx.font = '40px meine-schrift';
                    ctx.fillStyle = 'rgba(255,255,255,1)';

                    if ((this.timer.delta() * -1) <= 11) {

                        ctx.fillStyle = 'rgba(255,0,0,1)';

                        if (this.splashScreenCountUp) {
                            this.cntHelper += 0.05;
                            if (this.cntHelper >= 4) {
                                this.splashScreenCountUp = false;
                            }
                        } else {
                            this.cntHelper -= 0.05;
                            if (this.cntHelper <= 2.5) {
                                this.splashScreenCountUp = true;
                            }
                        }

                        var fontStr = (this.cntHelper * 13).toString() + 'px meine-schrift'
                        ctx.font = fontStr;
                    }

                    if (this.timer) {
                        if ((this.timer.delta() * -1) <= 11)
                            ctx.fillText('Time: ' + Math.floor(this.timer.delta() * -1).toString() + 's', 1050 * ig.system.scale - 15 * this.cntHelper * ig.system.scale, 60 * ig.system.scale);
                        else
                            ctx.fillText('Time: ' + Math.floor(this.timer.delta() * -1).toString() + 's', 1050 * ig.system.scale, 60 * ig.system.scale);

                    }

                    var player = ig.game.getEntityByName('player');

                    switch (player.currentWeapon) {
                        case 'pistol':
                            ctx.font = '40px meine-schrift';
                            ctx.fillStyle = 'rgba(255,255,255,1)';
                            ctx.fillText('Pistol: ', 550 * ig.system.scale, 60 * ig.system.scale);
                            this.infintyImage.draw(730 * ig.system.scale, 27 * ig.system.scale);
                            break;
                        case 'uzi':
                            ctx.font = '40px meine-schrift';
                            ctx.fillStyle = 'rgba(255,255,255,1)';
                            ctx.fillText('Uzi: ' + player.munition.uzi.toString(), 550 * ig.system.scale, 60 * ig.system.scale);
                            break;
                        case 'shotgun':
                            ctx.font = '40px meine-schrift';
                            ctx.fillStyle = 'rgba(255,255,255,1)';
                            ctx.fillText('Shotgun: ' + player.munition.shotgun.toString(), 550 * ig.system.scale, 60 * ig.system.scale);
                            break;
                    }

                    if (this.pickedUpAmmo) {
                        ctx.fillStyle = 'rgba(255,0,0,0.7)';
                        ctx.fillRect(20 * ig.system.scale, 740 * ig.system.scale, 300 * ig.system.scale, 56 * ig.system.scale);

                        ctx.font = '30px meine-schrift';
                        ctx.fillStyle = 'rgba(0,0,0,1)';
                        ctx.fillText('Picked up ammo', 30 * ig.system.scale, 780 * ig.system.scale);
                    }

                    if (this.pickedUpMedipack) {
                        ctx.fillStyle = 'rgba(255,0,0,0.7)';
                        ctx.fillRect(900 * ig.system.scale, 740 * ig.system.scale, 360 * ig.system.scale, 56 * ig.system.scale);

                        ctx.font = '30px meine-schrift';
                        ctx.fillStyle = 'rgba(0,0,0,1)';
                        ctx.fillText('Picked up medipack', 915 * ig.system.scale, 780 * ig.system.scale);
                    }

                    if (this.shouldShowNewWave) {
                        ctx.font = '120px meine-schrift';
                        ctx.fillStyle = 'rgba(255,255,255,1)';
                        ctx.fillText("New wave in " + Math.floor(this.newWaveTimer.delta() * -1).toString(), 120, 400);

                        if (this.newWaveTimer.delta() >= 0) {
                            this.shouldShowNewWave = false;
                            this.newWaveTimer.set(4);
                            this.newWaveTimer.pause();

                            switch (++this.currentLevel) {
                                case 2:
                                    ig.game.spawnEntity(EntityPolice, 88, 280);
                                    ig.game.spawnEntity(EntityPolice, 44, 1704);
                                    ig.game.spawnEntity(EntityPolice, 544, 1768);
                                    ig.game.spawnEntity(EntityPolice, 352, 1496);
                                    ig.game.spawnEntity(EntityPolice, 488, 288);
                                    ig.game.spawnEntity(EntityPolice, 528, 544);
                                    ig.game.spawnEntity(EntityPolice, 620, 260);
                                    break;
                                case 3:
                                    ig.game.spawnEntity(EntityPolice, 2296, 52);
                                    ig.game.spawnEntity(EntityPolice, 2248, 104);
                                    ig.game.spawnEntity(EntityPolice, 2184, 28);
                                    ig.game.spawnEntity(EntityPolice, 2108, 160);
                                    ig.game.spawnEntity(EntityPolice, 3040, 1780);
                                    ig.game.spawnEntity(EntityPolice, 2920, 1592);
                                    ig.game.spawnEntity(EntityPolice, 2692, 1700);
                                    ig.game.spawnEntity(EntityPolice, 2604, 1832);
                                    break;
                                case 4:
                                    ig.game.spawnEntity(EntityPolice, 2552, 600);
                                    ig.game.spawnEntity(EntityPolice, 2992, 548);
                                    ig.game.spawnEntity(EntityPolice, 2908, 656);
                                    ig.game.spawnEntity(EntityPolice, 2780, 536);
                                    ig.game.spawnEntity(EntityPolice, 1468, 1876);
                                    ig.game.spawnEntity(EntityPolice, 1580, 1848);
                                    ig.game.spawnEntity(EntityPolice, 1660, 1808);
                                    ig.game.spawnEntity(EntityPolice, 1392, 1820);
                                    ig.game.spawnEntity(EntityPolice, 1516, 1736);
                                    break;

                                case 5:
                                    ig.game.spawnEntity(EntityPolice, 88, 280);
                                    ig.game.spawnEntity(EntityPolice, 44, 1704);
                                    ig.game.spawnEntity(EntityPolice, 544, 1768);
                                    ig.game.spawnEntity(EntityPolice, 2184, 28);
                                    ig.game.spawnEntity(EntityPolice, 2108, 160);
                                    ig.game.spawnEntity(EntityPolice, 3040, 1780);
                                    ig.game.spawnEntity(EntityPolice, 2704, 600);
                                    ig.game.spawnEntity(EntityPolice, 2916, 840);
                                    ig.game.spawnEntity(EntityPolice, 3016, 536);
                                    ig.game.spawnEntity(EntityPolice, 248, 1232);
                                    break;

                                default: break;
                            }


                            this.timer.set(this.timerTime);
                        }
                    }

                } else if (this.state == 'highscoreMenu') {
                    if (localStorage.getItem('groupName') != 'global') {
                        this.highscoreEmptyImage.draw(0, 0);
                        ctx.font = '50px meine-schrift';
                        ctx.fillStyle = 'rgba(0,0,0,1)';
                        ctx.fillText('Leave ' + localStorage.getItem('groupName'), (500 - localStorage.getItem('groupName').length * 10) * ig.system.scale, 730 * ig.system.scale);
                    }

                    var cnt = 0;

                    ctx.font = '40px meine-schrift';
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    for (let i = 0; i < this.highscoreList.length; i++) {
                        if (this.highscoreList[i].group == localStorage.getItem('groupName')) {
                            if (++cnt < 6) {
                                ctx.fillText((cnt).toString() + '. ' + this.highscoreList[i].name, 200 * ig.system.scale, cnt * 80 + 215 * ig.system.scale);
                                ctx.fillText(this.highscoreList[i].points, 800 * ig.system.scale, cnt * 80 + 215 * ig.system.scale);
                            }

                        }
                    }

                } else if (this.state == 'battleModeMenu') {
                    ctx.font = '80px meine-schrift';
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    var groupToShow = this.enteredGroupName;
                    if (this.showCursor) {
                        groupToShow += '|';
                    }
                    ctx.fillText(groupToShow, 150 * ig.system.scale, 360 * ig.system.scale);

                    if (!this.shouldChangeCursor) {
                        this.shouldChangeCursor = true;
                        setTimeout(() => {
                            this.showCursor = !this.showCursor;
                            this.shouldChangeCursor = false;
                        }, 500);
                    }

                    if (this.enteredGroupName == "") {
                        ctx.font = '60px meine-schrift';
                        ctx.fillStyle = 'rgba(255,0,0,1)';
                        ctx.fillText('Name must not be empty', 215 * ig.system.scale, 700 * ig.system.scale);
                    }

                    if (this.shouldEnterGroup) {
                        if (this.groupNotFound) {
                            ctx.font = '60px meine-schrift';
                            ctx.fillStyle = 'rgba(255,0,0,1)';
                            ctx.fillText('Group not found', 300 * ig.system.scale, 700 * ig.system.scale);
                        }
                    } else if (this.shouldCreateGroup) {
                        if (this.groupNameExists) {
                            ctx.font = '60px meine-schrift';
                            ctx.fillStyle = 'rgba(255,0,0,1)';
                            ctx.fillText('Group already exists', 280 * ig.system.scale, 700 * ig.system.scale);
                        }
                    }
                }
            },

            //add leading zeros to a number
            pad: function (num, size) {
                var s = num + "";
                while (s.length < size) s = "0" + s;
                return s;
            },

            bindKeysForGame: function () {
                ig.input.unbindAll();

                ig.input.bind(ig.KEY.D, 'right');
                ig.input.bind(ig.KEY.A, 'left');
                ig.input.bind(ig.KEY.W, 'up');
                ig.input.bind(ig.KEY.S, 'down');
                ig.input.bind(ig.KEY.SPACE, 'shoot');

                ig.input.bind(ig.KEY.MOUSE1, 'click');

                ig.input.bind(ig.KEY.ESC, 'back');  //get back to the previous menu (in pause screen, this gets you back to the main menu
                ig.input.bind(ig.KEY.P, 'pause');

                ig.input.bind(ig.KEY._1, 'weapon1');
                ig.input.bind(ig.KEY._2, 'weapon2');
                ig.input.bind(ig.KEY._3, 'weapon3');
            },

            bindKeysForKeyboardInput: function () {
                this.test();
                ig.input.unbindAll();

                let charCodeA = 'A'.charCodeAt(0);

                //ig.KEY.A = 65, ig.KEY.Z = 90
                for (let i = 65; i <= 90; i++) {
                    ig.input.bind(i, String.fromCharCode(charCodeA + i - 65));
                }

                ig.input.bind(ig.KEY.BACKSPACE, 'backspace');
                ig.input.bind(ig.KEY.ENTER, 'enter');
                ig.input.bind(ig.KEY.MOUSE1, 'click');
            },

            test: function () {
                console.log('hello from test');
            },

            addNewHighscore: function (name, points) {
                var id = 0, oldPoints = points + 1;
                var groupName = localStorage.getItem('groupName');

                for (let i = 0; i < this.highscoreList.length; i++) {
                    if (this.highscoreList[i].name == name && this.highscoreList[i].group == groupName) {
                        id = this.highscoreList[i]._id;
                        oldPoints = this.highscoreList[i].points;
                        break;
                    }
                }

                if (id != 0) {
                    if (points < oldPoints)
                        return;
                    var url = ("https://www.businessofcrime.gq/api/highscores/" + id);
                    $.ajax({
                        type: "PUT",
                        url: url,
                        data: { points: points },
                        success: function (data, status, jqXHR) {
                            console.log("highscore success " + data);
                            console.log(name + ', ' + points);
                        },
                        error: function (jqXHR, status) {
                            console.log('highscore error');
                        }
                    });
                } else {
                    $.ajax({
                        type: "POST",
                        url: "https://www.businessofcrime.gq/api/highscore",
                        data: { name: name, points: points, group: groupName },
                        success: function (data, status, jqXHR) {
                            console.log("highscore success " + data);
                            console.log(name + ', ' + points);
                        },
                        error: function (jqXHR, status) {
                            console.log('highscore error');
                        }
                    });
                }
            },

            reloadHighscore: function () {
                return jQuery.ajax({
                    url: "https://www.businessofcrime.gq/api/highscore",
                    type: "GET",
                    async: false,
                    success: function (res) {
                        this.highscoreList = res;
                        this.highscoreList.sort((a, b) => {
                            return b.points - a.points;
                        });
                    }.bind(this),

                    error: function (jqXHR, textStatus, error) {

                    }
                });
            },


        });

        MyLoader = ig.Loader.extend({
            draw: function () {
                // Add your drawing code here
                ig.system.context.font = '60px meine-schrift';

                var w = ig.system.realWidth;
                var h = ig.system.realHeight;
                ig.system.context.fillStyle = '#000000';
                ig.system.context.fillRect(0, 0, w, h);

                ig.system.context.fillStyle = '#ffffff';
                ig.system.context.fillRect((w / 2 - 100 * 2), 230 * 2, 202 * 2, 40 * 2);
                ig.system.context.fillStyle = '#000000';
                ig.system.context.fillRect((w / 2 - 98 * 2), 232 * 2, this.status * 198 * 2, 36 * 2);

                var percentage = (this.status * 100).round() + '%';
                ig.system.context.fillStyle = '#ffffff';
                ig.system.context.fillText('Business of Crime is loading...', w / 2 - 500, 60);
                ig.system.context.font = '80px meine-schrift';
                ig.system.context.fillText(percentage, w / 2 - 80, h / 2);
            }
        });


        // Start the Game with 60fps, a resolution of 320x240, scaled
        // up by a factor of 2
        ig.main('#canvas', MyGame, 60, 1280, 800, 1, MyLoader);

    });
