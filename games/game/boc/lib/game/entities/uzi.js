ig.module(
    'game.entities.uzi'
)
    .requires(
    'impact.entity'
    )
    .defines(function () {

        EntityUzi = ig.Entity.extend({

            size: {
                x: 32,
                y: 32
            },

            collides: ig.Entity.COLLIDES.NEVER,

            animSheetRightUzi: new ig.AnimationSheet('media/weapon/Uzi/Rechts.png', 32, 32),
            animSheetLeftUzi: new ig.AnimationSheet('media/weapon/Uzi/Links.png', 32, 32),
            animSheetUpUzi: new ig.AnimationSheet('media/weapon/Uzi/Oben.png', 32, 32),
            animSheetDownUzi: new ig.AnimationSheet('media/weapon/Uzi/Unten.png', 32, 32),
            animSheetRightUpUzi: new ig.AnimationSheet('media/weapon/Uzi/Rechts Oben.png', 32, 32),
            animSheetRightDownUzi: new ig.AnimationSheet('media/weapon/Uzi/Rechts Unten.png', 32, 32),
            animSheetLeftUpUzi: new ig.AnimationSheet('media/weapon/Uzi/Links Oben.png', 32, 32),
            animSheetLeftDownUzi: new ig.AnimationSheet('media/weapon/Uzi/Links Unten.png', 32, 32),

            parentPlayer: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.parentPlayer = settings.parent;
                this.zIndex = 10000;

                this.anims.idleRight = new ig.Animation(this.animSheetRightUzi, 1, [0]);
                this.anims.shootingRight = new ig.Animation(this.animSheetRightUzi, 0.05, [1, 2, 3, 4], true);

                this.anims.idleLeft = new ig.Animation(this.animSheetLeftUzi, 1, [4]);
                this.anims.shootingLeft = new ig.Animation(this.animSheetLeftUzi, 0.05, [3, 2, 1, 0], true);

                this.anims.idleDown = new ig.Animation(this.animSheetDownUzi, 1, [0]);
                this.anims.shootingDown = new ig.Animation(this.animSheetDownUzi, 0.05, [1, 2, 3, 4], true);

                this.anims.idleUp = new ig.Animation(this.animSheetUpUzi, 1, [0]);
                this.anims.shootingUp = new ig.Animation(this.animSheetUpUzi, 0.05, [1, 2, 3, 4], true);

                this.anims.idleRightUp = new ig.Animation(this.animSheetRightUpUzi, 1, [0]);
                this.anims.shootingRightUp = new ig.Animation(this.animSheetRightUpUzi, 0.05, [1, 2, 3, 4], true);

                this.anims.idleRightDown = new ig.Animation(this.animSheetRightDownUzi, 1, [0]);
                this.anims.shootingRightDown = new ig.Animation(this.animSheetRightDownUzi, 0.05, [1, 2, 3, 4], true);

                this.anims.idleLeftUp = new ig.Animation(this.animSheetLeftUpUzi, 1, [4]);
                this.anims.shootingLeftUp = new ig.Animation(this.animSheetLeftUpUzi, 0.05, [3, 2, 1, 0], true);

                this.anims.idleLeftDown = new ig.Animation(this.animSheetLeftDownUzi, 1, [4]);
                this.anims.shootingLeftDown = new ig.Animation(this.animSheetLeftDownUzi, 0.05, [3, 2, 1, 0], true);

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
                if (this.parentPlayer.currentWeapon == 'uzi')
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











































