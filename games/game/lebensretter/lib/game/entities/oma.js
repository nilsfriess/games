ig.module(
        'game.entities.oma'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityOma = ig.Entity.extend({

            size: {
                x: 100,
                y: 124
            },
            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.A,
            collides: ig.Entity.COLLIDES.ACTIVE,
            vel: {
                x: 0,
                y: 60
            },
            i: 0,


            animSheet: new ig.AnimationSheet('media/Oma.png', 100, 124),

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                //console.log(this.currentAnim);
            },

            update: function() {
                if (ig.game.animTimer.delta >= 0)
                    console.log(ig.game.score);
                if (this.pos.y > 800 && this.pos.y < 801) {
                    ig.game.score += 50; // muss noch variabel gemacht werden
                    
                }


                this.parent();
            },

            collideWith: function(other, axis) {
                if (ig.game.spieltimer.delta() < 0) {
                    if (ig.game.spritzentimer.delta() > 0) {
                        if (ig.game.getEntityByName('krankenwagen').health == 1) {
                            //other.kill();
                            ig.game.gO = 1;
                            ig.game.sGameOver.play();
                            ig.game.spieltimer.set(0);
                        } else {
                            ig.game.animTimer.set(1);
                            ig.game.sTreffer.play();
                            other.currentAnim = other.anims.hit;
                            other.receiveDamage(1, this);
                            this.kill();
                        }
    
                    }
                }

                this.kill();

            },
        });
    });
