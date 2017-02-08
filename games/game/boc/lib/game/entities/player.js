var ig, EntityPlayer;
ig.module(
    'game.entities.player'
)
    .requires(
    'impact.entity',
    'game.entities.projectile',
    'plugins.perpixel',
    'game.entities.pistol',
    'game.entities.uzi',
    'game.entities.shotgun'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: {
                x: 80,
                y: 80
            },

            maxVel: {
                x: 10000,
                y: 10000
            },

            health: 100,

            walkVel: 280,

            currentWeapon: 'pistol',
            currentWeaponEntity: null,

            pistolEntity: null,
            uziEntity: null,
            shotgunEntity: null,

            shootVel: 800,

            munition: {
                uzi: 40,
                shotgun: 20
            },

            type: ig.Entity.TYPE.B,

            animSheetRight: new ig.AnimationSheet('media/player/Laufen Rechts.png', 80, 80),
            animSheetLeft: new ig.AnimationSheet('media/player/Links.png', 80, 80),
            animSheetUp: new ig.AnimationSheet('media/player/ObenRichtig.png', 80, 80),
            animSheetDown: new ig.AnimationSheet('media/player/Laufen nach unten.png', 80, 80),

            animSheetRightUp: new ig.AnimationSheet('media/player/RechtsOben.png', 80, 80),
            animSheetRightDown: new ig.AnimationSheet('media/player/Rechts unten.png', 80, 80),
            animSheetLeftUp: new ig.AnimationSheet('media/player/LinksOben.png', 80, 80),
            animSheetLeftDown: new ig.AnimationSheet('media/player/Links unten.png', 80, 80),

            cnt: 0,
            maxCnt: 10,

            lastDirection: 'right',
            moving: false,

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

                this.pistolEntity   = ig.game.spawnEntity(EntityPistol, this.pos.x, this.pos.y, { parent: this });
                this.uziEntity      = ig.game.spawnEntity(EntityUzi, this.pos.x, this.pos.y, { parent: this });
                this.shotgunEntity  = ig.game.spawnEntity(EntityShotgun, this.pos.x, this.pos.y, { parent: this });

                this.currentWeaponEntity = this.pistolEntity;
            },

            update: function () {
                this.parent();

                if (ig.game.state === 'playing') {
                    this.handleMovement();
                    this.handleShooting();
                    this.handleWeaponChange();
                } else {
                    this.vel = {
                        x: 0,
                        y: 0
                    };
                }

            },

            handleMovement: function () {
                this.moving = false;

                if (ig.input.state('right')) {
                    this.vel.x = this.walkVel;
                    this.moving = true;

                    if (ig.input.state('down')) { //player running right and down
                        this.currentAnim = this.anims.runningRightDown;
                        this.vel.y = this.walkVel;
                        this.lastDirection = 'rightDown';
                    } else if (ig.input.state('up')) { //player running right and up
                        this.currentAnim = this.anims.runningRightUp;
                        this.vel.y = -this.walkVel;
                        this.lastDirection = 'rightUp';
                    } else {
                        this.vel.y = 0;
                        this.currentAnim = this.anims.runningRight;
                        this.lastDirection = 'right';
                    }
                } else if (ig.input.state('left')) {
                    this.vel.x = -this.walkVel;
                    this.moving = true;

                    if (ig.input.state('down')) { //player running right and down
                        this.currentAnim = this.anims.runningLeftDown;
                        this.vel.y = this.walkVel;
                        this.lastDirection = 'leftDown';
                    } else if (ig.input.state('up')) { //player running right and up
                        this.currentAnim = this.anims.runningLeftUp;
                        this.vel.y = -this.walkVel;
                        this.lastDirection = 'leftUp';
                    } else {
                        this.vel.y = 0;
                        this.currentAnim = this.anims.runningLeft;
                        this.lastDirection = 'left';
                    }
                } else {
                    this.vel.x = 0;
                    if (ig.input.state('down')) { //player running right and down
                        this.moving = true;
                        this.currentAnim = this.anims.runningDown;
                        this.vel.y = this.walkVel;
                        this.lastDirection = 'down';
                    } else if (ig.input.state('up')) { //player running right and up
                        this.moving = true;
                        this.currentAnim = this.anims.runningUp;
                        this.vel.y = -this.walkVel;
                        this.lastDirection = 'up';
                    }
                }

                if (!this.moving) {
                    this.vel.x = 0;
                    this.vel.y = 0;

                    switch (this.lastDirection) {
                        case 'right':
                            this.currentAnim = this.anims.idleRight;

                            break;

                        case 'left':
                            this.currentAnim = this.anims.idleLeft;
                            break;

                        case 'up':
                            this.currentAnim = this.anims.idleUp;
                            break;

                        case 'down':
                            this.currentAnim = this.anims.idleDown;
                            break;

                        case 'rightDown':
                            this.currentAnim = this.anims.idleRightDown;
                            break;

                        case 'rightUp':
                            this.currentAnim = this.anims.idleRightUp;
                            break;

                        case 'leftDown':
                            this.currentAnim = this.anims.idleLeftDown;
                            break;

                        case 'leftUp':
                            this.currentAnim = this.anims.idleLeftUp;
                            break;
                        default:
                            this.currentAnim = this.anims.idleRight;
                            break;
                    }
                }
            },

            handleShooting: function () {

                let hasShot = true;

                if (this.currentWeapon != 'pistol') {
                    if (((this.currentWeapon == 'uzi') && (this.munition.uzi == 0)) || ((this.currentWeapon == 'shotgun') && (this.munition.shotgun == 0))) {
                        this.handleWeaponChange('pistol');
                    }
                }

                if ((ig.input.state('shoot') && this.lastDirection == 'right' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'right')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x + this.size.x - 20, this.pos.y + 35,
                        {
                            initialVel: {
                                x: this.shootVel + this.vel.x,
                                y: 0
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'left' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'left')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x - 10, this.pos.y + 26,
                        {
                            initialVel: {
                                x: -this.shootVel + this.vel.x,
                                y: 0
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'up' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'up')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x + 27, this.pos.y - 1,
                        {
                            initialVel: {
                                x: 9,
                                y: -this.shootVel + this.vel.y
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'down' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'down')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x - 10, this.pos.y + this.size.y + 1,
                        {
                            initialVel: {
                                x: 0,
                                y: this.shootVel + this.vel.y
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'rightUp' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'rightUp')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x + 60, this.pos.y + 20,
                        {
                            initialVel: {
                                x: this.shootVel + this.vel.x,
                                y: -this.shootVel + this.vel.y
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'rightDown' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'rightDown')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x + 30, this.pos.y + 55,
                        {
                            initialVel: {
                                x: this.shootVel + this.vel.x,
                                y: this.shootVel + this.vel.y
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'leftUp' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'leftUp')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x - 10, this.pos.y,
                        {
                            initialVel: {
                                x: -this.shootVel + this.vel.x,
                                y: -this.shootVel + this.vel.y
                            },
                            distance: this.getDistanceForCurrentWeapon(),
                            weapon: this.currentWeapon
                        });
                }

                else if ((ig.input.state('shoot') && this.lastDirection == 'leftDown' && ++this.cnt == this.maxCnt) || (ig.input.pressed('shoot') && this.lastDirection == 'leftDown')) {
                    let projectile = ig.game.spawnEntity(EntityProjectile, this.pos.x - 10, this.pos.y + 30, {
                        initialVel: {
                            x: -this.shootVel + this.vel.x,
                            y: this.shootVel + this.vel.y
                        },
                        distance: this.getDistanceForCurrentWeapon(),
                        weapon: this.currentWeapon
                    });
                } else {
                    hasShot = false;
                }

                if (this.cnt >= this.maxCnt)
                    this.cnt = 0;

                if (hasShot) {
                    this.currentWeaponEntity.startShooting();
                    switch (this.currentWeapon) {
                        case 'uzi':
                            this.munition.uzi--;
                            break;
                        case 'shotgun':
                            this.munition.shotgun--;
                            break;
                    }
                }

            },

            handleWeaponChange: function (weapon) {

                if (ig.input.pressed('weapon1') || weapon == 'pistol') {
                    this.currentWeapon = 'pistol';
                    this.maxCnt = 25;
                    this.currentWeaponEntity = this.pistolEntity;
                }

                else if (ig.input.pressed('weapon2') || weapon == 'uzi') {
                    this.currentWeapon = 'uzi';
                    this.maxCnt = 5;
                    this.currentWeaponEntity = this.uziEntity;
                }

                else if (ig.input.pressed('weapon3') || weapon == 'shotgun') {
                    this.currentWeapon = 'shotgun';
                    this.maxCnt = 12;
                    this.currentWeaponEntity = this.shotgunEntity;
                }
            },

            getDistanceForCurrentWeapon: function () {
                switch (this.currentWeapon) {
                    case 'pistol':
                        return 600;
                    case 'uzi':
                        return 1000;
                    case 'shotgun':
                        return 400;
                }
            }
        });
    });
