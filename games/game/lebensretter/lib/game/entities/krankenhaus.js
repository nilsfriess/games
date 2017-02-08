ig.module(
        'game.entities.krankenhaus'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityKrankenhaus = ig.Entity.extend({

            size: {
                x: 300,
                y: 126
            },
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,


            vel: {
                x: 0,
                y: 0
            },

            animSheet: new ig.AnimationSheet('media/Krankenhaus.png', 300, 126),

            init: function(x, y, settings) {

                this.parent(x, y, settings);
                this.zIndex = 10000000000;
                this.addAnim('idle', 1, [0]);
                //console.log(this.currentAnim);
            },

            update: function() {
                  if (ig.game.spieltimer.delta() >= -10) {
                       this.vel.y = 60;
                       ig.game.respawntimer.set(0);
                        ig.game.respawntimer.pause();
                    }
                this.parent();
            },

            collideWith: function(other, axis) {
                if (other == ig.game.getEntityByName('krankenwagen')) {
                    ig.game.sGewinn.play();
                    this.vel.y = 0;                  // Levelgeschafft Bildschirm aufrufen lassen
                    // ig.system.setGame(Gewinnbildschirm);
                    ig.game.score += 100;
                    
                    this.kill()



                }
            },
        });
    });
