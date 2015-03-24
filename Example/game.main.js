var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");

var then = Date.now();

// JOYKEY FUNCTIONS
var init = function() {

	var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d');
        
    jkeys.debug = true;

        
	jkeys.addKey(new Button({
         "fileUrl": 'basic/arrowUp.png',
         "height": 50,
         "width": 50,
         "drawX": 100,
         "drawY": 100,
         "nameIdentity": "upArrow",
         "canvasContext": context
    }));
        
    jkeys.addRegion(new Region({
        "name": "big6",
        "xOrigin": 150,
        "yOrigin": 150,
        "regionWidth": 600,
        "regionHeight": 600,
        "canvasContext": context
    }));
        
        
    jkeys.addSwipe(new Swipe({
        ident: "Right",
        distance: 50,
        time: 250,
        horizontal: true,
        swipeOnRegion: true,
        region: jkeys.getRegion("big6"),
        rangeDistance: 300,
        ve: "+",
        functiontime: 100
    }));
        
        
    jkeys.addSwipe(new Swipe({
        ident: "Left",
        distance: 50,
        time: 250,
        horizontal: true,
        swipeOnRegion: true,
        region: jkeys.getRegion("big6"),
        rangeDistance: 300,
        ve: "-",
        functiontime: 100
    }));
        
    jkeys.addSwipe(new Swipe({
        ident: "Down",
        distance: 50,
        time: 200,
        vertical: true,
        swipeOnRegion: true,
        region: jkeys.getRegion("big6"),
        rangeDistance: 300,
        ve: "-",
        functiontime: 200
    }));
        
    jkeys.addSwipe(new Swipe({
        ident: "Up",
        distance: 50,
        time: 200,
        vertical: true,
        rangeDistance: 300,
        ve: "+",
        functiontime: 200
    }));
		
        
	jkeys.isReady = true;
	startup(); // Call The Touch Event Listener
};

// BASIC BUTTONS CREDIT: http://kenney.nl/assets
resources.load([
// You May Use your own keys here (I can't Figure out how to upload images to here)
	'basic/arrowUp.png',
	'basic/arrowDown.png',
	'basic/arrowLeft.png',
	'basic/arrowRight.png',
	'basic/buttonA.png',
	'basic/buttonB.png',
	'basic/buttonX.png',
	'basic/buttonY.png'
]);
	
	
resources.onReady(init);
// END JOYKEYS

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var Player = function(X, Y, W, H) {
    this.x = X;
    this.y = Y;
    this.width = W;
    this.height = H;
};

Player.prototype.update = function(dt) {
    if (jkeys.isReady) { // Required Becuase for two clicks the system isn't in sync
        
        if (jkeys.getKey("upArrow").isPressed) {
            this.y -= 5;    
        }
        
    }
};

Player.prototype.draw = function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'blue';
    ctx.fill();
};

var tester = new Player(100, 100, 50, 50);

var Game = {

    update: function(dt) {
        tester.update(dt);
        jkeys.update();
        
        if (jkeys.isReady) {
            if (jkeys.getSwipe("Right").swiped) {
                console.log("Swipe Right Occured.");  
            }
            
            if (jkeys.getSwipe("Left").swiped) {
                console.log("Swipe Left Occured.");  
            }

            if (jkeys.getSwipe("Down").swiped) {
                console.log("Swipe Down Occured.");   
            } 
            if (jkeys.getSwipe("Up").swiped) {
                console.log("Swipe Up Occured.");    
            }
            
            if (jkeys.getRegion("big6").isPressed) {
                console.log("big6 Region is pressed.");
            }
        }
    },
    
    render: function(dt) {
        
        ctx.clearRect(0, 0, 800, 600);

        tester.draw();

        jkeys.draw();
        
        
    },
    
    run: function() {
        
    
        var FPS = 0;
        
        var now,
            dt = 0,
            last = Date.now(),
            slow = 1, // options.slow || 1
            step = 1/60, // 1/options.fps
            slowStep = slow * step;
        
        function frame() {

            now = Date.now();
            dt = dt + Math.min(1, (now - last)/1000);
                while (dt > slowStep) {
                    dt = dt - slowStep;
                    Game.update(step);
                }
            
            Game.render(dt/ slow);
            //console.log((now - last));
            last = now;
            requestAnimationFrame(frame);
        }
        
        requestAnimationFrame(frame);
    }
    
};


Game.run();
