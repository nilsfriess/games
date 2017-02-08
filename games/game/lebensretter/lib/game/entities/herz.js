ig.module(
        'game.entities.herz'
    )
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityHerz = ig.Entity.extend({

            size: {
                x: 75,
                y: 75
            },

            animSheet: new ig.AnimationSheet('media/Herz.png', 75, 75),

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('full', 1, [0]);
                this.addAnim('empty', 1, [1]);
                //console.log(this.currentAnim);
            },

            update: function() {
                if (ig.game.getEntityByName('krankenwagen').health >= 1) {
                    switch (ig.game.getEntityByName('krankenwagen').health) {
                        case 0:
                            ig.game.getEntityByName('herz1').currentAnim = this.anims.empty;
                            ig.game.getEntityByName('herz2').currentAnim = this.anims.empty;
                            ig.game.getEntityByName('herz3').currentAnim = this.anims.empty;
                            break;
                        case 1:
                            ig.game.getEntityByName('herz2').currentAnim = this.anims.empty;
                            ig.game.getEntityByName('herz3').currentAnim = this.anims.empty;
                            break;
                        case 2:
                            ig.game.getEntityByName('herz3').currentAnim = this.anims.empty;
                            break;
                        default:
                            this.currentAnim = this.anims.full;
                    }
                }
                this.parent();
            },

        });

    });
