ig.module(
    'game.entities.projectile'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityProjectile = ig.Entity.extend({

            size: { x: 16, y: 16 },
            maxVel: { x: 5000, y: 5000 },

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.LITE,

            initialVel: {
                x: 0,
                y: 0
            },

            initialPosition: {
                x: 0,
                y: 0
            },

            distance: 100000,

            weapon: null,

            animSheet: new ig.AnimationSheet('media/Schuss.png', 16, 16),

            sound: new ig.Sound('media/music/gunshot.ogg'),

            timer: new ig.Timer(),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);

                this.initialVel.x = this.vel.x = settings.initialVel.x;
                this.initialVel.y = this.vel.y = settings.initialVel.y;

                let helpVector = {x: 10, y: 0};

                this.anims.idle.angle = (Math.acos((helpVector.x*this.initialVel.x + helpVector.y*this.initialVel.y) / (this.vectorLength(helpVector) * this.vectorLength(this.initialVel))));
                //this.anims.idle.angle = (90).toRad();

                this.sound.volume = localStorage.getItem("volOff") == 'true' ? 0 : 0.05;
                this.sound.play();

                this.initialPosition.x = x;
                this.initialPosition.y = y;

                this.distance = settings.distance;

                this.weapon = settings.weapon;

                if (settings.weapon == 'shotgun') {

                    let degree = 4;

                    for (let i=degree; i<=2*degree; i += degree) {
                        let x1 = this.initialVel.x * Math.cos(this.toRadians(i)) - this.initialVel.y * Math.sin(this.toRadians(i));
                        let y1 = this.initialVel.x * Math.sin(this.toRadians(i)) + this.initialVel.y * Math.cos(this.toRadians(i));

                        ig.game.spawnEntity(EntityProjectile, x, y, { distance: settings.distance, weapon: 'shotgun2', initialVel: {x: x1, y: y1}} );

                        x1 = this.initialVel.x * Math.cos(this.toRadians(-i)) - this.initialVel.y * Math.sin(this.toRadians(-i));
                        y1 = this.initialVel.x * Math.sin(this.toRadians(-i)) + this.initialVel.y * Math.cos(this.toRadians(-i));

                        ig.game.spawnEntity(EntityProjectile, x, y, { distance: settings.distance, weapon: 'shotgun2', initialVel: {x: x1, y: y1}} );
                    }
                }

                this.timer.set(3);
            },

            update: function () {
                this.parent();

                if (this.timer.delta() >= 0)
                    this.kill();

                if (ig.game.state == 'paused') {
                    this.vel = {
                        x: 0,
                        y: 0
                    };
                } else if (ig.game.state == 'playing') {
                    this.vel.x = this.initialVel.x;
                    this.vel.y = this.initialVel.y;
                }

                if (Math.sqrt( Math.pow((this.initialPosition.x - this.pos.x), 2) + Math.pow((this.initialPosition.y - this.pos.y), 2) ) >= this.distance) {
                    this.kill();
                }
            },

            handleMovementTrace: function (res) {
                if (res.collision.y || res.collision.x)
                    this.kill();

                this.parent(res);
            },

            check: function (other) {
                if (this.weapon == 'police' && (other instanceof EntityPolice) && !other.isDead ) {
                    //this.kill();
                    return;
                }

                if ( ( this.weapon == 'pistol' || this.weapon == 'uzi' || this.weapon == 'shotgun' || this.weapon == 'shotgun2') && (other instanceof EntityPlayer) ) {
                    //this.kill();
                    return;
                }

                if (!other.isDead) {
                    other.receiveDamage(this.getDamageOfCurrentWeapon(), this);
                    this.kill();
                }

            },

            toRadians: function (angle) {
                return angle * (Math.PI / 180);
            },

            getDamageOfCurrentWeapon: function() {
                switch(this.weapon) {
                    case 'pistol':
                        return 8;
                    case 'uzi':
                        return 12;
                    case 'shotgun':
                        return 10;
                }

                return 10;
            },

            vectorLength: function(vec) {
                return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
            }
        });
    });
