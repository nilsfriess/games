ig.module(
    'game.entities.pistol'
)
    .requires(
    'impact.entity'
    )
    .defines(function () {

        EntityPistol = ig.Entity.extend({

            size: {
                x: 32,
                y: 32
            },

            collides: ig.Entity.COLLIDES.NEVER,

            animSheetRightPistol: new ig.AnimationSheet('media/weapon/pistol/Rechts.png', 32, 32),
            animSheetLeftPistol: new ig.AnimationSheet('media/weapon/pistol/Links.png', 32, 32),
            animSheetUpPistol: new ig.AnimationSheet('media/weapon/pistol/Oben.png', 32, 32),
            animSheetDownPistol: new ig.AnimationSheet('media/weapon/pistol/Unten.png', 32, 32),
            animSheetRightUpPistol: new ig.AnimationSheet('media/weapon/pistol/Rechts Oben.png', 32, 32),
            animSheetRightDownPistol: new ig.AnimationSheet('media/weapon/pistol/Rechts Unten.png', 32, 32),
            animSheetLeftUpPistol: new ig.AnimationSheet('media/weapon/pistol/Links Oben.png', 32, 32),
            animSheetLeftDownPistol: new ig.AnimationSheet('media/weapon/pistol/Links Unten.png', 32, 32),

            parentPlayer: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.parentPlayer = settings.parent;
                this.zIndex = 10000;

                this.anims.idleRight = new ig.Animation(this.animSheetRightPistol, 1, [0]);
                this.anims.shootingRight = new ig.Animation(this.animSheetRightPistol, 0.05, [1, 2, 3, 4], true);

                this.anims.idleLeft = new ig.Animation(this.animSheetLeftPistol, 1, [4]);
                this.anims.shootingLeft = new ig.Animation(this.animSheetLeftPistol, 0.05, [3, 2, 1, 0], true);

                this.anims.idleDown = new ig.Animation(this.animSheetDownPistol, 1, [0]);
                this.anims.shootingDown = new ig.Animation(this.animSheetDownPistol, 0.05, [1, 2, 3, 4], true);

                this.anims.idleUp = new ig.Animation(this.animSheetUpPistol, 1, [0]);
                this.anims.shootingUp = new ig.Animation(this.animSheetUpPistol, 0.05, [1, 2, 3, 4], true);

                this.anims.idleRightUp = new ig.Animation(this.animSheetRightUpPistol, 1, [0]);
                this.anims.shootingRightUp = new ig.Animation(this.animSheetRightUpPistol, 0.05, [1, 2, 3, 4], true);

                this.anims.idleRightDown = new ig.Animation(this.animSheetRightDownPistol, 1, [0]);
                this.anims.shootingRightDown = new ig.Animation(this.animSheetRightDownPistol, 0.05, [1, 2, 3, 4], true);

                this.anims.idleLeftUp = new ig.Animation(this.animSheetLeftUpPistol, 1, [4]);
                this.anims.shootingLeftUp = new ig.Animation(this.animSheetLeftUpPistol, 0.05, [3, 2, 1, 0], true);

                this.anims.idleLeftDown = new ig.Animation(this.animSheetLeftDownPistol, 1, [4]);
                this.anims.shootingLeftDown = new ig.Animation(this.animSheetLeftDownPistol, 0.05, [3, 2, 1, 0], true);

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
                                this.pos.y = this.parentPlayer.pos.y + 20;
                                break;

                            case 'left':
                                this.currentAnim = this.anims.idleLeft;
                                this.pos.x = this.parentPlayer.pos.x - 25;
                                this.pos.y = this.parentPlayer.pos.y + 20;
                                break;

                            case 'up':
                                this.currentAnim = this.anims.idleUp;
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y - 20;
                                break;

                            case 'down':
                                this.currentAnim = this.anims.idleDown;
                                this.pos.x = this.parentPlayer.pos.x + 3;
                                this.pos.y = this.parentPlayer.pos.y + 34;
                                break;

                            case 'rightDown':
                                this.currentAnim = this.anims.idleRightDown;
                                this.pos.x = this.parentPlayer.pos.x + 15;
                                this.pos.y = this.parentPlayer.pos.y + 40;
                                break;

                            case 'rightUp':
                                this.currentAnim = this.anims.idleRightUp;
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y + 7;
                                break;

                            case 'leftUp':
                                this.currentAnim = this.anims.idleLeftUp;
                                this.pos.x = this.parentPlayer.pos.x + 0;
                                this.pos.y = this.parentPlayer.pos.y + 0;
                                break;

                            case 'leftDown':
                                this.currentAnim = this.anims.idleLeftDown;
                                this.pos.x = this.parentPlayer.pos.x - 12;
                                this.pos.y = this.parentPlayer.pos.y + 17;
                                break;
                        }
                    } else {
                        switch (this.parentPlayer.lastDirection) {
                            case 'right':
                                this.pos.x = this.parentPlayer.pos.x + 37;
                                this.pos.y = this.parentPlayer.pos.y + 20;
                                break;

                            case 'left':
                                this.pos.x = this.parentPlayer.pos.x - 25;
                                this.pos.y = this.parentPlayer.pos.y + 20;
                                break;

                            case 'up':
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y - 20;
                                break;

                            case 'down':
                                this.pos.x = this.parentPlayer.pos.x + 3;
                                this.pos.y = this.parentPlayer.pos.y + 34;
                                break;

                            case 'rightDown':
                                this.pos.x = this.parentPlayer.pos.x + 15;
                                this.pos.y = this.parentPlayer.pos.y + 40;
                                break;

                            case 'rightUp':
                                this.pos.x = this.parentPlayer.pos.x + 40;
                                this.pos.y = this.parentPlayer.pos.y + 7;
                                break;

                            case 'leftUp':
                                this.pos.x = this.parentPlayer.pos.x + 0;
                                this.pos.y = this.parentPlayer.pos.y + 0;
                                break;

                            case 'leftDown':
                                this.pos.x = this.parentPlayer.pos.x - 12;
                                this.pos.y = this.parentPlayer.pos.y + 17;
                                break;
                        }
                    }
                } else {
                    switch (this.parentPlayer.lastDirection) {
                        case 'right':
                            this.currentAnim = this.anims.idleRight;
                            this.pos.x = this.parentPlayer.pos.x + 37;
                            this.pos.y = this.parentPlayer.pos.y + 20;
                            break;

                        case 'left':
                            this.currentAnim = this.anims.idleLeft;
                            this.pos.x = this.parentPlayer.pos.x - 25;
                            this.pos.y = this.parentPlayer.pos.y + 20;
                            break;

                        case 'up':
                            this.currentAnim = this.anims.idleUp;
                            this.pos.x = this.parentPlayer.pos.x + 40;
                            this.pos.y = this.parentPlayer.pos.y - 20;
                            break;

                        case 'down':
                            this.currentAnim = this.anims.idleDown;
                            this.pos.x = this.parentPlayer.pos.x + 3;
                            this.pos.y = this.parentPlayer.pos.y + 34;
                            break;

                        case 'rightDown':
                            this.currentAnim = this.anims.idleRightDown;
                            this.pos.x = this.parentPlayer.pos.x + 15;
                            this.pos.y = this.parentPlayer.pos.y + 40;
                            break;

                        case 'rightUp':
                            this.currentAnim = this.anims.idleRightUp;
                            this.pos.x = this.parentPlayer.pos.x + 40;
                            this.pos.y = this.parentPlayer.pos.y + 7;
                            break;

                        case 'leftUp':
                            this.currentAnim = this.anims.idleLeftUp;
                            this.pos.x = this.parentPlayer.pos.x + 0;
                            this.pos.y = this.parentPlayer.pos.y + 0;
                            break;

                        case 'leftDown':
                            this.currentAnim = this.anims.idleLeftDown;
                            this.pos.x = this.parentPlayer.pos.x - 12;
                            this.pos.y = this.parentPlayer.pos.y + 17;
                            break;

                    }
                }


            },

            draw: function () {
                if (this.parentPlayer.currentWeapon == 'pistol')
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











































