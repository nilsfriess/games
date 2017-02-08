ig.module(
        'game.entities.pflaster'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityPflaster = ig.Entity.extend({

            size: {
                x: 100,
                y: 42
            },
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,
            vel: {
                x: 0,
                y: 60
            },

            animSheet: new ig.AnimationSheet('media/Pflaster.png', 100, 50),

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

                    if (ig.game.getEntityByName('krankenwagen').health < 3) {
                        other.receiveDamage(-1, this);
                    }

                    if (other == ig.game.getEntityByName('krankenwagen')) {
                        ig.game.score += 25;
                        
                    }
                }
                this.kill();
            },
        });
    });
