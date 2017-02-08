ig.module(
        'game.entities.strich'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityStrich = ig.Entity.extend({

            size: {
                x: 50,
                y: 100
            },
            type: ig.Entity.TYPE.B,
            vel: {
                x: 0,
                y: 60
            },

            animSheet: new ig.AnimationSheet('media/Strich.png', 50, 100),

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.zIndex = 1;

                //console.log(this.currentAnim);
            },

            update: function() {
                if (ig.game.spieltimer.delta() >= 0)
                {
                    this.vel.y = 0;
                }

                if (this.pos.y > 799) {
                    this.pos.y = -200;
                }
                this.parent();
            }

        });
    });
