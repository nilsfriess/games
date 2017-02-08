ig.module(
    'game.entities.munition'
)
    .requires(
    'impact.entity',
    'game.entities.player'
    )
    .defines(function () {

        EntityMunition = ig.Entity.extend({

            size: {
                x: 40,
                y: 40
            },

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            animSheet: new ig.AnimationSheet('media/munition.png', 40, 40),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.anims.idle = new ig.Animation(this.animSheet, 1, [0]);
                this.currentAnim = this.anims.idle;
            },

            update: function () {
                this.vel.x = 0;
                this.vel.y = 0;
            },

            check: function (other) {
                if (other instanceof EntityPlayer) {
                    if (this.getRandomInt(0, 100) % 2 == 0) {
                        other.munition.shotgun += 10;
                    } else {
                        other.munition.uzi += 10;
                    }

                    ig.game.pickedUpAmmo = true;
                    setTimeout(() => {
                        ig.game.pickedUpAmmo = false;
                    }, 2000);

                    this.kill();
                }
            },

            getRandomInt: function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }
        });
    });
