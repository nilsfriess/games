ig.module(
    'game.entities.shotgun'
)
    .requires(
    'impact.entity'
    )
    .defines(function () {

        EntityShotgun = ig.Entity.extend({

            size: {
                x: 64,
                y: 64
            },

            collides: ig.Entity.COLLIDES.NEVER,

            animSheetRightShotgun:      new ig.AnimationSheet('media/weapon/Shotgun/Rechts.png', 64, 64),
            animSheetLeftShotgun:       new ig.AnimationSheet('media/weapon/Shotgun/Links.png', 64, 64),
            animSheetUpShotgun:         new ig.AnimationSheet('media/weapon/Shotgun/Oben.png', 64, 64),
            animSheetDownShotgun:       new ig.AnimationSheet('media/weapon/Shotgun/Unten.png', 64, 64),
            animSheetRightUpShotgun:    new ig.AnimationSheet('media/weapon/Shotgun/Rechts Oben.png', 64, 64),
            animSheetRightDownShotgun:  new ig.AnimationSheet('media/weapon/Shotgun/Rechts Unten.png', 64, 64),
            animSheetLeftUpShotgun:     new ig.AnimationSheet('media/weapon/Shotgun/Links Oben.png', 64, 64),
            animSheetLeftDownShotgun:   new ig.AnimationSheet('media/weapon/Shotgun/Links Unten.png', 64, 64),

            parentPlayer: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.parentPlayer = settings.parent;
                this.zIndex = 10000;

                this.anims.idleRight =          new ig.Animation(this.animSheetRightShotgun, 1, [0]);
                this.anims.shootingRight =      new ig.Animation(this.animSheetRightShotgun, 0.05, [1, 2, 3, 4], true);

                this.anims.idleLeft =           new ig.Animation(this.animSheetLeftShotgun, 1, [4]);
                this.anims.shootingLeft =       new ig.Animation(this.animSheetLeftShotgun, 0.05, [3, 2, 1, 0], true);

                this.anims.idleDown =           new ig.Animation(this.animSheetDownShotgun, 1, [0]);
                this.anims.shootingDown =       new ig.Animation(this.animSheetDownShotgun, 0.05, [1, 2, 3, 4], true);

                this.anims.idleUp =             new ig.Animation(this.animSheetUpShotgun, 1, [4]);
                this.anims.shootingUp =         new ig.Animation(this.animSheetUpShotgun, 0.05, [2, 2, 1, 0], true);

                this.anims.idleRightUp =        new ig.Animation(this.animSheetRightUpShotgun, 1, [0]);
                this.anims.shootingRightUp =    new ig.Animation(this.animSheetRightUpShotgun, 0.05, [1, 2, 3, 4], true);

                this.anims.idleRightDown =      new ig.Animation(this.animSheetRightDownShotgun, 1, [0]);
                this.anims.shootingRightDown =  new ig.Animation(this.animSheetRightDownShotgun, 0.05, [1, 2, 3, 4], true);

                this.anims.idleLeftUp =         new ig.Animation(this.animSheetLeftUpShotgun, 1, [4]);
                this.anims.shootingLeftUp =     new ig.Animation(this.animSheetLeftUpShotgun, 0.05, [3, 2, 1, 0], true);

                this.anims.idleLeftDown =       new ig.Animation(this.animSheetLeftDownShotgun, 1, [4]);
                this.anims.shootingLeftDown =   new ig.Animation(this.animSheetLeftDownShotgun, 0.05, [3, 2, 1, 0], true);

                this.currentAnim = this.anims.idleRight;
            },

            update: function () {
                this.parent();

                if (!this.parentPlayer)
                    return;

                if (this.currentAnim == this.anims.shootingRight ||
                    this.currentAnim == this.anims.shootingLeft ||
                    this.currentAnim == this.anims.shootingUp ||
                    this.currentAnim == this.anims.shootingDown ||
                    this.currentAnim == this.anims.shootingLeftDown ||
                    this.currentAnim == this.anims.shootingLeftUp ||
                    this.currentAnim == this.anims.shootingRightDown ||
                    this.currentAnim == this.anims.shootingRightUp) {
                    if (this.currentAnim.loopCount) {
                        switch (this.parentPlayer.lastDirection) {
                            case 'right':
                                this.currentAnim = this.anims.idleRight;
                                this.pos.x = this.parentPlayer.pos.x + 37;
                                this.pos.y = this.parentPlayer.pos.y - 10;
                                break;

                            case 'left':
                                this.currentAnim = this.anims.idleLeft;
                                this.pos.x = this.parentPlayer.pos.x - 40;
                                this.pos.y = this.parentPlayer.pos.y - 10;
                                break;

                            case 'up':
                                this.currentAnim = this.anims.idleUp;
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y - 30;
                                break;

                            case 'down':
                                this.currentAnim = this.anims.idleDown;
                                this.pos.x = this.parentPlayer.pos.x;
                                this.pos.y = this.parentPlayer.pos.y + 30;
                                break;

                            case 'rightDown':
                                this.currentAnim = this.anims.idleRightDown;
                                this.pos.x = this.parentPlayer.pos.x + 15;
                                this.pos.y = this.parentPlayer.pos.y + 10;
                                break;

                            case 'rightUp':
                                this.currentAnim = this.anims.idleRightUp;
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y - 25;
                                break;

                            case 'leftUp':
                                this.currentAnim = this.anims.idleLeftUp;
                                this.pos.x = this.parentPlayer.pos.x - 27;
                                this.pos.y = this.parentPlayer.pos.y - 27;
                                break;

                            case 'leftDown':
                                this.currentAnim = this.anims.idleLeftDown;
                                this.pos.x = this.parentPlayer.pos.x - 35;
                                this.pos.y = this.parentPlayer.pos.y;
                                break;
                        }
                    } else {
                        switch (this.parentPlayer.lastDirection) {
                            case 'right':
                                this.pos.x = this.parentPlayer.pos.x + 37;
                                this.pos.y = this.parentPlayer.pos.y - 10;
                                break;

                            case 'left':
                                this.pos.x = this.parentPlayer.pos.x - 45;
                                this.pos.y = this.parentPlayer.pos.y - 10;
                                break;

                            case 'up':
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y - 30;
                                break;

                            case 'down':
                                this.pos.x = this.parentPlayer.pos.x;
                                this.pos.y = this.parentPlayer.pos.y + 30;
                                break;

                            case 'rightDown':
                                this.pos.x = this.parentPlayer.pos.x + 15;
                                this.pos.y = this.parentPlayer.pos.y + 10;
                                break;

                            case 'rightUp':
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y - 25;
                                break;

                            case 'leftUp':
                                this.pos.x = this.parentPlayer.pos.x - 27;
                                this.pos.y = this.parentPlayer.pos.y - 27;
                                break;

                            case 'leftDown':
                                this.pos.x = this.parentPlayer.pos.x - 35;
                                this.pos.y = this.parentPlayer.pos.y;
                                break;
                        }
                    }
                } else {
                    switch (this.parentPlayer.lastDirection) {
                        case 'right':
                            this.currentAnim = this.anims.idleRight;
                            this.pos.x = this.parentPlayer.pos.x + 37;
                            this.pos.y = this.parentPlayer.pos.y - 10;
                            break;

                        case 'left':
                            this.currentAnim = this.anims.idleLeft;
                            this.pos.x = this.parentPlayer.pos.x - 45;
                            this.pos.y = this.parentPlayer.pos.y - 10;
                            break;

                        case 'up':
                            this.currentAnim = this.anims.idleUp;
                            this.pos.x = this.parentPlayer.pos.x + 40;
                            this.pos.y = this.parentPlayer.pos.y - 30;
                            break;

                        case 'down':
                            this.currentAnim = this.anims.idleDown;
                            this.pos.x = this.parentPlayer.pos.x;
                            this.pos.y = this.parentPlayer.pos.y + 30;
                            break;

                        case 'rightDown':
                            this.currentAnim = this.anims.idleRightDown;
                            this.pos.x = this.parentPlayer.pos.x + 15;
                            this.pos.y = this.parentPlayer.pos.y + 10;
                            break;

                        case 'rightUp':
                            this.currentAnim = this.anims.idleRightUp;
                            this.pos.x = this.parentPlayer.pos.x + 40;
                            this.pos.y = this.parentPlayer.pos.y - 25;
                            break;

                        case 'leftUp':
                            this.currentAnim = this.anims.idleLeftUp;
                            this.pos.x = this.parentPlayer.pos.x - 27;
                            this.pos.y = this.parentPlayer.pos.y - 27;
                            break;

                        case 'leftDown':
                            this.currentAnim = this.anims.idleLeftDown;
                            this.pos.x = this.parentPlayer.pos.x - 35;
                            this.pos.y = this.parentPlayer.pos.y;
                            break;

                    }
                }


            },

            draw: function () {
                if (this.parentPlayer.currentWeapon == 'shotgun')
                    this.parent();
            },

            startShooting: function () {
                if (!this.parentPlayer)
                    return;

                switch (this.parentPlayer.lastDirection) {
                    case 'right':
                        this.currentAnim = this.anims.shootingRight.rewind();

                        break;

                    case 'left':
                        this.currentAnim = this.anims.shootingLeft.rewind();
                        break;

                    case 'up':
                        this.currentAnim = this.anims.shootingUp.rewind();
                        break;

                    case 'down':
                        this.currentAnim = this.anims.shootingDown.rewind();
                        break;

                    case 'rightDown':
                        this.currentAnim = this.anims.shootingRightDown.rewind();
                        break;

                    case 'rightUp':
                        this.currentAnim = this.anims.shootingRightUp.rewind();
                        break;

                    case 'leftUp':
                        this.currentAnim = this.anims.shootingLeftUp.rewind();
                        break;

                    case 'leftDown':
                        this.currentAnim = this.anims.shootingLeftDown.rewind();
                        break;

                }
            }
        });
    });











































