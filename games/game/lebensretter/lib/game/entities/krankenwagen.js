ig.module(
        'game.entities.krankenwagen'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityKrankenwagen = ig.Entity.extend({

            size: {
                x: 100,
                y: 205
            },
            friction: {
                x: 150,
                y: 150
            },

            health: 3,

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.FIXED,

            animSheet: new ig.AnimationSheet('media/RTW_Animation.png', 100, 205),

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                ig.game.specialEntity = this;

                this.addAnim('idle', 1, [0]);
                this.addAnim('hit', 0.25, [0, 1, 2, 3]);
                this.zIndex = 10000;
                //console.log(this.currentAnim);
            },

            update: function() {
                if (ig.game.animTimer.delta() >= 0) {
                    this.currentAnim = this.anims.idle.rewind();
                }
               

                if (ig.input.state('left')) {
                    this.vel.x = -95;

                }

                if (ig.input.state('right')) {
                    this.vel.x = 95;
                }

                if (this.health)
                    this.parent();
            },


            // }
            draw: function(reallyDraw) {
                // Only draw when the 'reallyDraw' param is true,
                // so it ignores the "normal" draw call
                if (reallyDraw) {
                    this.parent();
                }
            },
        });
    });
