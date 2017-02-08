ig.module(
    'game.entities.medipack'
)
    .requires(
    'impact.entity',
    'game.entities.player'
    )
    .defines(function () {

        EntityMedipack = ig.Entity.extend({

            size: {
                x: 40,
                y: 40
            },

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,

            animSheet: new ig.AnimationSheet('media/medipack.png', 40, 40),

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
                    other.health += 25;
                    if (other.health > 100)
                        other.health = 100;

                    ig.game.pickedUpMedipack = true;
                    setTimeout(() => {
                        ig.game.pickedUpMedipack = false;
                    }, 2000);

                    this.kill();
                }
            }
        });
    });
