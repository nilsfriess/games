ig.module(
        'game.entities.spritze'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntitySpritze = ig.Entity.extend({

            size: {
                x: 74,
                y: 75
            },
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,

            vel: {
                x: 0,
                y: 60
            },


            animSheet: new ig.AnimationSheet('media/Spritze.png', 74, 75),

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                //console.log(this.currentAnim);
            },

            update: function() {

                this.parent();

            },
            collideWith: function(other, axis) {

                if (ig.game.spieltimer.delta() < 0) {
                   ig.game.sPosObj.play();
                    ig.game.score += 25;
                    ig.game.spritzentimer.set(10);
                   

                }
                this.kill();

            }
        });
    });
