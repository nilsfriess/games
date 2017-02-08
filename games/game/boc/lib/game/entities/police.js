ig.module(
    'game.entities.police'
)
    .requires(
    'impact.entity',
    'game.entities.projectile',
    'game.entities.policehud',
    'game.entities.munition',
    'game.entities.medipack',
    'game.entities.blood',
    'game.entities.pistol',
    'plugins.perpixel'
    )
    .defines(function () {

        EntityPolice = ig.Entity.extend({

            size: {
                x: 80,
                y: 80
            },
            maxVel: {
                x: 10000,
                y: 10000
            },

            health: 100,

            hud: null,

            type: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.ACTIVE,

            animSheetRight: new ig.AnimationSheet('media/police/Laufen Rechts.png', 80, 80),
            animSheetLeft: new ig.AnimationSheet('media/police/Links.png', 80, 80),
            animSheetUp: new ig.AnimationSheet('media/police/ObenRichtig.png', 80, 80),
            animSheetDown: new ig.AnimationSheet('media/police/Laufen nach unten.png', 80, 80),

            animSheetRightUp: new ig.AnimationSheet('media/police/RechtsOben.png', 80, 80),
            animSheetRightDown: new ig.AnimationSheet('media/police/Rechts unten.png', 80, 80),
            animSheetLeftUp: new ig.AnimationSheet('media/police/LinksOben.png', 80, 80),
            animSheetLeftDown: new ig.AnimationSheet('media/police/Links unten.png', 80, 80),

            cnt: 0,

            lastDirection: 'right',
            moving: false,

            initialVel: 120,

            timeoutTime: 400,

            shouldDie: false,
            isDead: false,

            currentWeaponEntitiy: null,

            currentWeapon: 'pistol',

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.anims.idleRight = new ig.Animation(this.animSheetRight, 1, [0]);
                this.anims.runningRight = new ig.Animation(this.animSheetRight, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.anims.idleLeft = new ig.Animation(this.animSheetLeft, 1, [0]);
                this.anims.runningLeft = new ig.Animation(this.animSheetLeft, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.anims.idleUp = new ig.Animation(this.animSheetUp, 1, [0]);
                this.anims.runningUp = new ig.Animation(this.animSheetUp, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.anims.idleDown = new ig.Animation(this.animSheetDown, 1, [0]);
                this.anims.runningDown = new ig.Animation(this.animSheetDown, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);


                this.anims.idleRightUp = new ig.Animation(this.animSheetRightUp, 1, [0]);
                this.anims.runningRightUp = new ig.Animation(this.animSheetRightUp, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.anims.idleRightDown = new ig.Animation(this.animSheetRightDown, 1, [0]);
                this.anims.runningRightDown = new ig.Animation(this.animSheetRightDown, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.anims.idleLeftUp = new ig.Animation(this.animSheetLeftUp, 1, [0]);
                this.anims.runningLeftUp = new ig.Animation(this.animSheetLeftUp, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.anims.idleLeftDown = new ig.Animation(this.animSheetLeftDown, 1, [0]);
                this.anims.runningLeftDown = new ig.Animation(this.animSheetLeftDown, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);

                this.currentAnim = this.anims.idleRight;

                this.hud = ig.game.spawnEntity(EntityPolicehud, this.pos.x, this.pos.y, { parent: this });

                this.currentWeaponEntitiy = ig.game.spawnEntity(EntityPistol, this.pos.x, this.pos.y, { parent: this });
            },

            update: function () {
                var player = ig.game.getEntityByName('player');
                if (ig.game.state != 'playing' || !player)
                    return;

                if (this.isDead) {
                    this.currentAnim = this.anims.idleRight;
                    this.currentAnim.angle = -1.57;
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.collides = ig.Entity.COLLIDES.NEVER;
                    this.parent();
                    return;
                }

                this.parent();

                if (this.distanceTo(player) < 1100) {


                    if (this.pos.x - player.pos.x < -30) {                    //police right of player
                        if (this.pos.y - player.pos.y > 30) {
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningRightUp;
                                this.vel.x = this.initialVel;
                                this.vel.y = -this.initialVel;
                                this.lastDirection = 'rightUp';
                            }, this.timeoutTime);                              //right and above
                        } else if (this.pos.y - player.pos.y < -30) {         //right and under
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningRightDown
                                this.vel.x = this.initialVel;
                                this.vel.y = this.initialVel;
                                this.lastDirection = 'rightDown';
                            }, this.timeoutTime);
                        } else {                                        //right and same height
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningRight;
                                this.vel.x = this.initialVel;
                                this.vel.y = 0;
                                this.lastDirection = 'right';
                            }, this.timeoutTime);
                        }
                    } else if (this.pos.x - player.pos.x > 30) {             //police left of player
                        if (this.pos.y - player.pos.y > 30) {                //left and above
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningLeftUp;
                                this.vel.x = -this.initialVel;
                                this.vel.y = -this.initialVel;
                                this.lastDirection = 'leftUp';
                            }, this.timeoutTime);
                        } else if (this.pos.y - player.pos.y < -30) {         //left and under
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningLeftDown;
                                this.vel.x = -this.initialVel;
                                this.vel.y = this.initialVel;
                                this.lastDirection = 'leftDown';
                            }, this.timeoutTime);
                        } else {                                        //left and same height
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningLeft;
                                this.vel.x = -this.initialVel;
                                this.vel.y = 0;
                                this.lastDirection = 'left';
                            }, this.timeoutTime);
                        }
                    } else {                                            //same as player
                        if (this.pos.y - player.pos.y > 30) {                //above
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningUp;
                                this.vel.x = 0;
                                this.vel.y = -this.initialVel;
                                this.lastDirection = 'up';
                            }, this.timeoutTime);
                        } else if (this.pos.y - player.pos.y < 30) {         //under
                            setTimeout(() => {
                                this.currentAnim = this.anims.runningDown;
                                this.vel.x = 0;
                                this.vel.y = this.initialVel;
                                this.lastDirection = 'down';
                            }, this.timeoutTime);

                        } else {                                        //same height

                        }
                    }
                } else {
                    this.vel.x = 0;
                    this.vel.y = 0;
                }

                if (this.distanceTo(player) < 400 && this.distanceTo(player) > 30) {
                    if (++this.cnt >= 40) {
                        this.cnt = 0;

                        var x, y;

                        switch (this.lastDirection) {
                            case 'right':
                                x = this.pos.x + this.size.x - 20;
                                y = this.pos.y + 35;
                                break;

                            case 'left':
                                x = this.pos.x - 10;
                                y = this.pos.y + 26;
                                break;

                            case 'up':
                                x = this.pos.x + 27;
                                y = this.pos.y - 1;
                                break;

                            case 'down':
                                x = this.pos.x - 10;
                                y = this.pos.y + this.size.y + 1;
                                break;

                            case 'rightUp':
                                x = this.pos.x + 60;
                                y = this.pos.y + 20;
                                break;

                            case 'rightDown':
                                x = this.pos.x + 30;
                                y = this.pos.y + 55;
                                break;

                            case 'leftUp':
                                x = this.pos.x - 10;
                                y = this.pos.y;
                                break;

                            case 'leftDown':
                                x = this.pos.x - 10;
                                y = this.pos.y + 30;
                                break;
                        }

                        ig.game.spawnEntity(EntityProjectile, x, y, {
                            initialVel: {
                                x: this.vel.x * 6.6,
                                y: this.vel.y * 6.6
                            },
                            distance: 400,
                            weapon: "police"
                        });
                        this.currentWeaponEntitiy.startShooting();
                    }
                }

                if (this.touches(player)) {
                    player.kill();
                }
            },

            kill: function () {

                if (this.isDead) {
                    if (this.shouldDie) {
                        this.parent();
                    }
                    return;
                }

                this.isDead = true;

                ig.game.spawnEntity(EntityBlood, this.pos.x, this.pos.y + 60);

                this.hud.kill();
                this.currentWeaponEntitiy.kill();
                ig.game.points += 100;

                let rand = this.getRandomInt(0, 100);

                if (rand % 7 == 0) {
                    ig.game.spawnEntity(EntityMunition, this.pos.x, this.pos.y);
                } else if (rand % 6 == 0) {
                    ig.game.spawnEntity(EntityMedipack, this.pos.x, this.pos.y);
                }

                this.pos.y += 20;

                var that = this;

                setTimeout(() => {
                    that.shouldDie = true;
                    that.kill();
                }, 700);
            },

            getRandomInt: function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }
        });
    });
