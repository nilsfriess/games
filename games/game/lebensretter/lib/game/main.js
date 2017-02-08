ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'impact.font',
        'game.levels.first',
        'game.levels.second',
        'game.entities.oma',
        'game.entities.mulltonne',
        'game.entities.kaktus',
        'game.entities.verkaufer',
        'game.entities.ball',
        'game.entities.pflaster',
        'game.entities.spritze',
        'game.entities.krankenhaus'

    )
    .defines(function() {

        Menu = ig.Game.extend({
           
            instructionImage: new ig.Image('media/Menu.jpg'),
            tonAus: new ig.Image('media/TonAus.png', 75, 75),
            tonAn: new ig.Image('media/TonAn.png', 75, 75),
           
            init: function() {
                if (!sessionStorage.getItem("schalter")) {
                    sessionStorage.setItem("schalter", 0);
                    }
                ig.music.pause();
                ig.input.bind(ig.KEY.MOUSE1, 'klick');
                ig.input.initMouse();
                if(schalter == 0 && x ==0)
                {
                    schalter ==1;
                    sMenu.stop();
                    }
                if(schalter ==1 &&x ==1)
                {
                    sMenu.stop();
                    }
                else{sMenu.stop();
                    sMenu.play();
                sMenu.volume = 0.7}


            },
            update: function() {
                console.log(schalter);
                console.log(x);
                this.parent();


                if (ig.input.mouse.x > 75 && ig.input.mouse.x < 400 && ig.input.mouse.y > 275 && ig.input.mouse.y < 375 && ig.input.pressed('klick')) {
                    ig.system.setGame(Story1);

                }
                if (ig.input.mouse.x > 125 && ig.input.mouse.x < 450 && ig.input.mouse.y > 400 && ig.input.mouse.y < 500 && ig.input.pressed('klick')) {
                     window.open("https://sites.google.com/site/lebensretterspiel/highscore"); 
                }
                if (ig.input.mouse.x > 175 && ig.input.mouse.x < 500 && ig.input.mouse.y > 525 && ig.input.mouse.y < 625 && ig.input.pressed('klick')) {
                    ig.system.setGame(Steuerung);
                }
               
                 if (ig.input.mouse.x > 100 && ig.input.mouse.x < 175 && ig.input.mouse.y > 700 && ig.input.mouse.y < 775 && ig.input.pressed('klick')) {
                    if (schalter === 0) {
                        schalter = 1;
                        sMenu.stop();
                        x = 1;
                    } else {
                        schalter = 0;
                        sMenu.stop();
                        sMenu.play();
                        sMenu.volume = 0.7;
                        x = 1;
                    }
                
                
                }
            
            },
            draw: function() {
                this.parent();
                this.instructionImage.draw(0, 0);
                if (schalter === 0) {
                     
                this.tonAn.draw(100, 700);
                } else {
                   
                   this.tonAus.draw(100, 700);
                }
            }
        });


        Steuerung = ig.Game.extend({
            instructionImage: new ig.Image('media/Steuerung.jpg'),
            init: function() {
                ig.input.bind(ig.KEY.MOUSE1, 'klick');
                ig.input.initMouse();
            

            },
            update: function() {
                this.parent();

                if (ig.input.mouse.x > 25 && ig.input.mouse.x < 350 && ig.input.mouse.y > 225 && ig.input.mouse.y < 300 && ig.input.pressed('klick')) {
                    ig.system.setGame(Menu);
                }
            },
            draw: function() {
                this.parent();
                this.instructionImage.draw(0, 0);
            }
        });
       

        Story1 = ig.Game.extend({
            instructionImage: new ig.Image('media/Story_Screen_1.jpg'),
            init: function() {
                ig.input.bind(ig.KEY.MOUSE1, 'klick');
                ig.input.initMouse();
                sMenu.stop();

            },
            update: function() {

                this.parent();
                if (ig.input.pressed('klick')) {
                    level = 'level1';
                    ig.system.setGame(MyGame);
                }
            },
            draw: function() {
                this.parent();
                this.instructionImage.draw(0, 0);
            }
        });
        Story2 = ig.Game.extend({
            instructionImage: new ig.Image('media/Story_Screen_2.jpg'),
            init: function() {
                ig.input.bind(ig.KEY.MOUSE1, 'klick');
                ig.input.initMouse();

            },
            update: function() {
                this.parent();
                if (ig.input.pressed('klick')) {
                    ig.system.setGame(MyGame);
                }
            },
            draw: function() {
                this.parent();
                this.instructionImage.draw(0, 0);
            }
        });


        MyGame = ig.Game.extend({
            sGameOver: new ig.Sound('media/sounds/gameover.ogg'),
            sGewinn: new ig.Sound('media/sounds/win.ogg'),
            
            sTreffer: new ig.Sound('media/sounds/collid.ogg'),
             

            sPosObj: new ig.Sound('media/sounds/collect.ogg'),
            // Load a font
            animTimer: new ig.Timer(0),
            score: 0,
            
            ergebnistext:'',
            font: new ig.Font('media/04b03.font.png'),
            respawntimer: new ig.Timer(2),
            spieltimer: null,
            spritzentimer: null,
            levelFertig: new ig.Image('media/Level_geschafft.png'), //Bild definieren
            gameOver: new ig.Image('media/Game_Over.png'),
            gO: 0,
            t:0,
            x: 1,
            schalter: 1,
            init: function() {
               console.log(schalter);
                console.log(x);
                // Initialize your game here; bind keys etc.
                if (!sessionStorage.getItem("score")) {
                    sessionStorage.setItem("score", 0);
                    }
                 if (!sessionStorage.getItem("health")) {
                    sessionStorage.setItem("health", 0);
                    }
                 if (!sessionStorage.getItem("music")) {
                    sessionStorage.setItem("music", 0);
                    }
                
                ig.music.add( 'media/sounds/ingam.ogg' );

                
                ig.music.play();
                ig.music.volume = 0.2;
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                sMenu.volume=0.0;
                sMenu.stop();
                if (level == 'level2') {
                    this.loadLevel(LevelSecond);
                    this.spieltimer = new ig.Timer(90);
                    this.respawntimer.unpause();
                    this.respawntimer.reset();
                    this.t = 4;
                    this.score =  parseInt(sessionStorage.getItem("score"));
                    ig.game.getEntityByName('krankenwagen').health =  parseInt(sessionStorage.getItem("health"));
                    ig.game.getEntityByName('music').change =  parseInt(sessionStorage.getItem("music"));

                } else {
                   
                    this.spieltimer = new ig.Timer(60);
                    this.t = 5.5;
                    this.respawntimer.unpause();
                    this.score = 0;
                    this.loadLevel(LevelFirst);

                }
               if(schalter ==1 &&x ==1)
                {
                    schalter =0;
                    x =0;
                    ig.game.getEntityByName('music').change=0;}
                    this.spritzentimer = new ig.Timer(0);
            },

            update: function() {
                console.log(ig.game.getEntityByName('music').change);
                // Update all entities and backgroundMaps
                this.parent();
                var entity = null;
                /*if (this.respawntimer.delta() > 0) {
                    console.log("spawn Entity");
                    this.spawnEntity(EntityStrich, 580, 0);
                    this.respawntimer.set(3);
                }*/
                if (this.respawntimer.delta() > 1) {
                    var zufall = Math.floor(Math.random() * (7)) + 1;
                    var x = Math.random() * 210 + 430; // zufällig auf der Straße
                    switch (zufall) {
                        case 1:
                            entity = 'EntityOma';
                            break;
                        case 2:
                            entity = 'EntityPflaster';
                            break;
                        case 3:
                            entity = 'EntitySpritze';
                            break;
                        case 4:
                            entity = 'EntityVerkaufer';
                            break;
                        case 5:
                            entity = 'EntityBall';
                            break;
                        case 6:
                            entity = 'EntityKaktus';
                            break;
                        case 7:
                            entity = 'EntityMulltonne';
                            break;
                    }
                    ig.game.spawnEntity(entity, x, 0, null); // Eine Entity spawnen lassen
                    this.respawntimer.set(this.t);
                  
                }

                if (this.spieltimer.delta() >= 0) {
                    sessionStorage.setItem("score", this.score);
                     sessionStorage.setItem("health", ig.game.getEntityByName('krankenwagen').health);
                     sessionStorage.setItem("music", ig.game.getEntityByName('music').change);
                    
                     

                    if (ig.input.pressed('klick')) {
                        if (level == 'level2') {
                            level = 'level1';
                             this.ergebnistext=prompt("Deine Score: "+ this.score+"\nWie heissen Sie?","");
                              console.log(this.ergebnistext);
                           
                             jQuery.get( "http://webtechlecture.appspot.com/highscore/add?gamename=lebensretter&playername="+this.ergebnistext+"&points="+sessionStorage.getItem("score"));  
                            this.sGameOver.stop();
                              this.sGewinn.stop();
                            this.sPosObj.stop();
                            this.sTreffer.stop();
                            ig.system.setGame(Menu);
                           


                        } else {
                            if (this.gO === 0) {
                                level = 'level2';
                                this.sGewinn.stop();
                                ig.system.setGame(Story2);
                            } else {
                                this.ergebnistext=prompt("Deine Score: "+ this.score+"\nWie heissen Sie?","");
                                console.log(this.ergebnistext);
                                
                                jQuery.get( "http://webtechlecture.appspot.com/highscore/add?gamename=lebensretter&playername="+this.ergebnistext+"&points="+sessionStorage.getItem("score"))  
                                this.sGameOver.stop();
                                this.sGewinn.stop();
                                this.sPosObj.stop();
                                this.sTreffer.stop();
                                this.level = 'level1';
                                ig.system.setGame(Menu);
                                
                            }
                        }

                    }
                    //ig.system.setGame(LevelGeschafft);
                }
                // Add your own, additional update code here
            },
           
            
            draw: function() {
                // Draw all entities and backgroundMaps
                this.parent();
                this.specialEntity.draw(true);
                

                if (this.font) {
                    // Use our font to print: Health: player.health, X, Y, center_text
                    var font = new ig.Font('media/font.png');
                    font.draw('Score: ' + this.score, 150, 48, ig.Font.ALIGN.CENTER);
                    if (this.spritzentimer.delta() <= 0) {
                        font.draw(Math.round(ig.game.spritzentimer.delta()) * -1 + 's', 1137, 253, ig.Font.ALIGN.CENTER);
                    }
                } else {}

                var canvas = document.getElementById('canvas');
                var context = canvas.getContext("2d");
               
                if (this.spieltimer.delta() <= 0) {
                     if (level == 'level2') {
                    context.beginPath();
                    context.rect(1150, 710, this.spieltimer.delta() * 3.6111, 50);
                    context.fillStyle = "BLACK";
                    context.fill();}
                    else{context.beginPath();
                    context.rect(1150, 710, this.spieltimer.delta() * 5.4166, 50);
                    context.fillStyle = "BLACK";
                    context.fill();
                }
                }
                if (this.spieltimer.delta() >= 0) {
                    this.levelFertig.draw(0, 0);
                }
                if (this.gO == 1) {
                    this.gameOver.draw(0, 0);
                }
                // Add your own drawing code here
                var x = ig.system.width / 2,
                    y = ig.system.height / 2;

            }
        });

        // Start the Game with 60fps, a resolution of 320x240, scaled
        // up by a factor of 2
        
        var sMenu = new ig.Sound('media/sounds/meni.ogg');
        var level = 'level1'; 
     var schalter = 0;
     var x = 0;
        ig.main('#canvas', Menu, 70, 1200, 800, 1);
    });
