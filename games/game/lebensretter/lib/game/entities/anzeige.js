ig.module(
        'game.entities.anzeige'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityAnzeige = ig.Entity.extend({

            size: {
                x: 125,
                y: 225
            },


            animSheet: new ig.AnimationSheet('media/Spritze_Power.png', 125, 225),

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('active', 1, [0]);
                this.addAnim('full', 1, [1]);
                //console.log(this.currentAnim);
            },

            update: function() {
                if (ig.game.spritzentimer.delta() < 0) {
                    this.currentAnim = this.anims.active;

                } else {
                    this.currentAnim = this.anims.full;
                }
                this.parent();
            },
        });
    });
