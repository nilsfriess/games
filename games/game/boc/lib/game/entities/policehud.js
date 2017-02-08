var ig, EntityPlayer;
ig.module(
    'game.entities.policehud'
)
    .requires(
    'impact.entity'
    )
    .defines(function () {

        EntityPolicehud = ig.Entity.extend({

            parentPolice: null,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.parentPolice = settings.parent;
            },

            update: function () {
                this.parent();
            },

            draw: function () {
                this.parent();

                let ctx = ig.system.context;

                if (this.parentPolice) {
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fillRect(this.parentPolice.pos.x - ig.game.screen.x, this.parentPolice.pos.y - ig.game.screen.y - 15, this.parentPolice.health * 0.6 * ig.system.scale, 10 * ig.system.scale);
                }
            }
        });
    });