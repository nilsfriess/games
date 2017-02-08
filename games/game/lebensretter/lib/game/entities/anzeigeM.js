ig.module(
        'game.entities.anzeigeM'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityAnzeigeM = ig.Entity.extend({

            size: {
                x: 75,
                y: 75
            },

            change: 1,
            x: 0,
            animSheet: new ig.AnimationSheet('media/Ton.png', 75, 75),

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('active', 1, [0]);
                this.addAnim('off', 1, [1]);
               
                //console.log(this.currentAnim);
            },

            update: function() {
                
                    if (this.change === 0) {
                        ig.game.sGameOver.volume = 0.0;
                        ig.game.sTreffer.volume=0.0;
                        ig.game.sPosObj.volume=0.0;
                        ig.game.sGewinn.volume =0.0;
                        ig.music.pause();
                        
                        this.currentAnim = this.anims.off;
                        
                    } else {
                        ig.music.play();
                        ig.music.volume = 0.2;
                        ig.game.sGameOver.volume = 1.0;
                        ig.game.sTreffer.volume=1.0;
                        ig.game.sPosObj.volume=1.0;
                        ig.game.sGewinn.volume =1.0;
                        this.currentAnim = this.anims.active;
                        
                    }
                    if (ig.input.mouse.x > 1086 && ig.input.mouse.x < 1161 && ig.input.mouse.y > 30 && ig.input.mouse.y < 105 && ig.input.pressed('klick')) {
                        if(this.change ==0)
                        {
                            this.change = 1;
                            this.x = 1;
                        }
                        else{this.change = 0;
                            this.x = 1}
            }
                this.parent();
            },

        });

    });
