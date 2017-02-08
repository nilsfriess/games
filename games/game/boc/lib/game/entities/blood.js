ig.module(
    'game.entities.blood'
)
    .requires(
        'impact.entity',
        'game.entities.player'
    )
    .defines(function () {

        EntityBlood = ig.Entity.extend({

            size: {
                x: 32,
                y: 32
            },

            animSheet: new ig.AnimationSheet('media/blut.png', 32, 32),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.anims.blood = new ig.Animation(this.animSheet, 0.4, [0,1,2,3], true);
                this.currentAnim = this.anims.blood;
            },

            update: function() {
                this.parent();

                if(this.currentAnim.loopCount)
                    this.kill();
            }
        });
    });
