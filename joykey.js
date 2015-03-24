
/*

    JoyKeys Version 1.05 ALPHA
    By: Vishal Ramkissoon
    Date: 24/03/15 @ 1:06PM 

*/

	var Button = function(options) {
        /*
            Creates a button sprite.
            ALSO NEEDS A CONTEXT.
        */
		this.file = options.fileUrl;
		this.spriteHeight = options.height;
		this.spriteWidth = options.width;
		this.drawnAtX = options.drawX;
		this.drawnAtY = options.drawY;
		this.isPressed = false;
        this.drawContext = options.canvasContext;
        this.id = options.nameIdentity;
	};
		
	Button.prototype.draw = function() {
		this.drawContext.drawImage(resources.get(this.file), 
		  0,
		  0,
		  this.spriteWidth,
		  this.spriteHeight,
		  this.drawnAtX,
		  this.drawnAtY,
		  this.spriteWidth,
		  this.spriteHeight
		);	
	}
		
	Button.prototype.press = function() {
		this.isPressed = true;	
	}
		
	Button.prototype.leave = function() {
		this.isPressed = false;	
	}
        
    var Region = function(options) {
        /*
            Creates a touch-able region with the provided data
        */
        
        this.id = options.name;
        this.x = options.xOrigin;
        this.y = options.yOrigin;
        this.width = options.regionWidth;
        this.height = options.regionHeight;
        this.drawContext = options.canvasContext;
		this.isPressed = false;
        
    };

    Region.prototype.debugDraw = function() {
        this.drawContext.beginPath();
        this.drawContext.globalAlpha = 0.3;
        this.drawContext.rect(this.x, this.y, this.width, this.height);
        this.drawContext.fillStyle = 'red';
        this.drawContext.fill();
        this.drawContext.globalAlpha = 1;
    };
        
    Region.prototype.press = function() {
        this.isPressed = true;    
    };
        
    Region.prototype.unpress = function() {
        this.isPressed = false;    
    };

    var Swipe = function(options) {
        this.id = options.ident; // "STRING"
        this.distance = options.distance;
        this.time = options.time;
        this.actionCompleted = false;
        this.swiped = false;
        this.vertical = options.vertical||false;
        this.horizontal = options.horizontal||false;
        this.swipeOnRegion = options.swipeOnRegion||false;
        this.regionForSwipe = options.region||null;
        this.ve = options.ve; // differenciates between left and right
        this.rangeDistance = options.range||50;
        this.swipedTime = 0;
        this.swipeFunctionTime = options.functiontime;
    };

    Swipe.prototype.unSwipe = function() {
        this.swiped = false;    
    };

    Swipe.prototype.update = function() {
        
        if (this.swiped && (new Date().getTime() - this.swipedTime >= this.swipeFunctionTime)) {
            this.unSwipe();
        }
    };

    var BoundObject = function(params) {
        this.id = params.name;
        this.obj = params.objectToBind;
        this.isHeld = false;
    };


    BoundObject.prototype.toX = function(value) {
        this.obj.x = value;
    };

    BoundObject.prototype.toY = function(value) {
        this.obj.y = value;
    };

    BoundObject.prototype.moveTo = function(x, y) {
        this.obj.x = x;
        this.obj.y = y;
    };


	var joyKeys = function() {
		this.keys = new Array();
        this.regions = new Array();
        this.swipes = new Array();
        
        this.objectPool = new Array();
        
        this.isReady = false;
        this.debug = false;
	};

    joyKeys.prototype.bindObject = function(params) {
        this.objectPool[this.objectPool.length++] = new BoundObject(params);
    };

    joyKeys.prototype.addSwipe = function(swipe) {
        this.swipes[this.swipes.length++] = swipe;
    };

    joyKeys.prototype.getSwipe = function(str) {
        var swipe;
        
            for (var i = 0; i < this.swipes.length; i++) {
                if (this.swipes[i].id === str) swipe = this.swipes[i];    
            }
        
        return swipe;
    };

	joyKeys.prototype.addKey = function(button) {
		this.keys[this.keys.length++] = button;
	};

    joyKeys.prototype.getKey = function(str) {
        var key;
        
            for (var i = 0; i < this.keys.length; i++) {
                if (this.keys[i].id === str) key = this.keys[i];    
            }
        
        return key;
    };

    joyKeys.prototype.addRegion = function(region) {
        this.regions[this.regions.length++] = region;
    };

    joyKeys.prototype.getRegion = function(str) {
        var region;
        
            for (var i = 0; i < this.regions.length; i++) {
                if (this.regions[i].id === str) region = this.regions[i];    
            }
        
        return region;
    };
	
	joyKeys.prototype.draw = function() {
		for (var x = 0; x < this.keys.length; x++) {
			this.keys[x].draw();	
		}
        
        if (this.debug) {
            for (var x = 0; x < this.keys.length; x++) {
                this.regions[x].debugDraw();	
            }
        }
	};
	
	joyKeys.prototype.update = function() {
        for (var x = 0; x < this.swipes.length; x++) {
            this.swipes[x].update();    
        }
	};

    var timeObs = function(i, time,x, y) {
        this.nameX = i;
        this.start = time;
        this.startX = x;
        this.startY = y;
    }
    
	function findTimeObs(idToFind) {
		for (var i=0; i < ongoingTouches.length; i++) {
			var id = ongoingTouches[i].nameX;
			console.log(idToFind);
			if (id == idToFind) {
				return ongoingTouches[i];
			}
		}
		
		return null;    // not found
	};
	
	var jkeys = new joyKeys();

	var ongoingTouches = new Array();
    var ongoingTimes = new Array();

	function startup() {
		var el = document.getElementsByTagName("canvas")[0];
		el.addEventListener("touchstart", handleStart, false);
		el.addEventListener("touchend", handleEnd, false);
		el.addEventListener("touchcancel", handleCancel, false);
		el.addEventListener("touchleave", handleEnd, false);
		el.addEventListener("touchmove", handleMove, false);
	};
	
	
	function handleStart(evt) {
		evt.preventDefault();
		var el = document.getElementsByTagName("canvas")[0];
		var ctx = el.getContext("2d");
		var touches = evt.changedTouches;
			for (var i=0; i < touches.length; i++) {
				//100, 300
                ongoingTimes.push(new timeObs(i, new Date().getTime(), touches[i].pageX - this.offsetLeft, touches[i].pageY - this.offsetTop));
                
                // HANDLE Keys 
				for (var j = 0; j < jkeys.keys.length; j++) {
					if (touches[i].pageX - this.offsetLeft > jkeys.keys[j].drawnAtX && touches[i].pageX - this.offsetLeft <= jkeys.keys[j].drawnAtX + jkeys.keys[i].spriteWidth &&
						touches[i].pageY - this.offsetTop > jkeys.keys[j].drawnAtY && touches[i].pageY - this.offsetTop <= jkeys.keys[j].drawnAtY + jkeys.keys[i].spriteHeight) {
						jkeys.keys[j].press();
					}
				}
                
                // Handle Regions
                
                for (var j = 0; j < jkeys.regions.length; j++) {
                    if (((touches[i].pageX - this.offsetLeft) > jkeys.regions[j].x) &&
                        ((touches[i].pageX - this.offsetLeft) <= (jkeys.regions[j].x + jkeys.regions[j].width))) {
                        
                        if (((touches[i].pageY - this.offsetTop) > jkeys.regions[j].y) &&
                            ((touches[i].pageY - this.offsetTop) <= (jkeys.regions[j].y + jkeys.regions[j].height))) {
                                jkeys.regions[j].press();
                        }
                        
                    }
                }
				
                // Handle Objects
                
                for (var j = 0; j < jkeys.objectPool.length; j++) {
                    if (((touches[i].pageX - this.offsetLeft) > jkeys.objectPool[j].obj.x) &&
                        ((touches[i].pageX - this.offsetLeft) <= (jkeys.objectPool[j].obj.x + jkeys.objectPool[j].obj.width))) {
                        
                        if (((touches[i].pageY - this.offsetTop) > jkeys.objectPool[j].obj.y) &&
                            ((touches[i].pageY - this.offsetTop) <= (jkeys.objectPool[j].obj.y + jkeys.objectPool[j].obj.height))) {
                                jkeys.objectPool[j].isHeld = true;
                        }
                        
                    }
                }
                
				ongoingTouches.push(copyTouch(touches[i]));
			}
	};
	
	function handleMove(evt) {
		evt.preventDefault();
		var el = document.getElementsByTagName("canvas")[0];
		var ctx = el.getContext("2d");
		var touches = evt.changedTouches;
		
		for (var i=0; i < touches.length; i++) {
			var color = colorForTouch(touches[i]);
			var idx = ongoingTouchIndexById(touches[i].identifier);
			if(idx >= 0) {
				
                
                // Handle Keys
				for (var j = 0; j < jkeys.keys.length; j++) {
                   if (touches[i].pageX - this.offsetLeft < jkeys.keys[j].drawnAtX || touches[i].pageX - this.offsetLeft >= jkeys.keys[j].drawnAtX + jkeys.keys[i].spriteWidth ||
                      touches[i].pageY - this.offsetTop < jkeys.keys[j].drawnAtY || touches[i].pageY - this.offsetTop >= jkeys.keys[j].drawnAtY + jkeys.keys[i].spriteHeight) {
                            jkeys.keys[j].leave();
                        } else {
                            jkeys.keys[j].press();
                        }
				}
                
                // Handle Regions
                
                for (var j = 0; j < jkeys.regions.length; j++) {
                    
 
                    if (((touches[i].pageX - this.offsetLeft) < jkeys.regions[j].x) ||
                        ((touches[i].pageX - this.offsetLeft) >= (jkeys.regions[j].x + jkeys.regions[j].width)) ||
                        ((touches[i].pageY - this.offsetTop) < jkeys.regions[j].y) ||
                        ((touches[i].pageY - this.offsetTop) >= (jkeys.regions[j].y + jkeys.regions[j].height))) {
                        
                        jkeys.regions[j].unpress();
                        
                    } else {
                        jkeys.regions[j].press();    
                    }
                    
                }
                
                // Handle Objects
                
                for (var j = 0; j < jkeys.objectPool.length; j++) {
                    if (jkeys.objectPool[j].isHeld) {
                        jkeys.objectPool[j].moveTo((touches[i].pageX - this.offsetLeft), (touches[i].pageY - this.offsetTop));    
                    }
                }
				
				ctx.moveTo(ongoingTouches[idx].pageX - this.offsetLeft, ongoingTouches[idx].pageY - this.offsetTop);
				ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
                ongoingTimes.splice(idx, 1, ongoingTimes[i]);
			} else {
//				log("can't figure out which touch to continue");
			}
		}
	};
	
	
	function handleEnd(evt) {
		evt.preventDefault();
		var el = document.getElementsByTagName("canvas")[0];
		var ctx = el.getContext("2d");
		var touches = evt.changedTouches;
		
		for (var i=0; i < touches.length; i++) {
			var color = colorForTouch(touches[i]);
			var idx = ongoingTouchIndexById(touches[i].identifier);
			
			if(idx >= 0) {
                
                // Handle Swipe Data;
                            
                for (var l = 0; l < jkeys.swipes.length; l++) {
                    var currentElapsed = new Date().getTime() - ongoingTimes[i].start
                    
                    if (currentElapsed <= jkeys.swipes[l].time) {
                        
                        if (jkeys.swipes[l].horizontal) {
                            if (jkeys.swipes[l].ve == '+') {
                                
                                if ((touches[i].pageX - this.offsetLeft) > ongoingTimes[i].startX) {
                                    if ((touches[i].pageX - this.offsetLeft) - ongoingTimes[i].startX >= jkeys.swipes[l].distance) {
                                        
                                        if ((touches[i].pageY - this.offsetTop) >= ongoingTimes[i].startY - jkeys.swipes[l].rangeDistance && 
                                            (touches[i].pageY - this.offsetTop) <= ongoingTimes[i].startY + jkeys.swipes[l].rangeDistance) {
                                            if (jkeys.swipes[l].swipeOnRegion) {
                                                if (((touches[i].pageX - this.offsetLeft) >= jkeys.swipes[l].regionForSwipe.x) &&
                                                    ((touches[i].pageX - this.offsetLeft) <= (jkeys.swipes[l].regionForSwipe.x + jkeys.swipes[l].regionForSwipe.width)) &&
                                                    ((touches[i].pageY - this.offsetTop) >= jkeys.swipes[l].regionForSwipe.y) &&
                                                    ((touches[i].pageY - this.offsetTop) <= (jkeys.swipes[l].regionForSwipe.y + jkeys.swipes[l].regionForSwipe.height))) {
                                                
                                                    jkeys.swipes[l].swiped = true;
                                                    jkeys.swipes[l].swipedTime = new Date().getTime();
                                                } // END INSIDE REGION CHECK 
                                            }// END swipeOnRegion CHECK
                                            else {
                                           
                                                jkeys.swipes[l].swiped = true;
                                                jkeys.swipes[l].swipedTime = new Date().getTime();    
                                            }
                                            
                                        } // END Y RANGE DISTANCE CHECK
                                        
                                    } // END X RANGE DISTANCE CHECK
                                } // END ORIGIN CHECK

                            } 
                            if (jkeys.swipes[l].ve == '-') { 
                                
                                if ((touches[i].pageX - this.offsetLeft) < ongoingTimes[i].startX) {
                                    if (-((touches[i].pageX - this.offsetLeft) - ongoingTimes[i].startX) >= jkeys.swipes[l].distance) {
                                        if ((touches[i].pageY - this.offsetTop) >= ongoingTimes[i].startY - jkeys.swipes[l].rangeDistance && 
                                            (touches[i].pageY - this.offsetTop) <= ongoingTimes[i].startY + jkeys.swipes[l].rangeDistance) {
                                            if (jkeys.swipes[l].swipeOnRegion) {
                                                if (((touches[i].pageX - this.offsetLeft) >= jkeys.swipes[l].regionForSwipe.x) &&
                                                    ((touches[i].pageX - this.offsetLeft) <= (jkeys.swipes[l].regionForSwipe.x + jkeys.swipes[l].regionForSwipe.width)) &&
                                                    ((touches[i].pageY - this.offsetTop) >= jkeys.swipes[l].regionForSwipe.y) &&
                                                    ((touches[i].pageY - this.offsetTop) <= (jkeys.swipes[l].regionForSwipe.y + jkeys.swipes[l].regionForSwipe.height))) {
                                                    
                                                    jkeys.swipes[l].swiped = true;
                                                    jkeys.swipes[l].swipedTime = new Date().getTime();
                                                } // END INSIDE REGION CHECK 
                                            }// END swipeOnRegion CHECK
                                            else {
                                                jkeys.swipes[l].swiped = true;
                                                jkeys.swipes[l].swipedTime = new Date().getTime();    
                                            } 
                                        }
                                    }       
                                }
                                
                            } // END VE '-' CHECK
                        } // END HORIZONTAL CHECK
                        if (jkeys.swipes[l].vertical) {
                            if (jkeys.swipes[l].ve == '+') {
                                if ((touches[i].pageY - this.offsetTop) < ongoingTimes[i].startY) {
                                    if (-((touches[i].pageY - this.offsetTop) - ongoingTimes[i].startY) >= jkeys.swipes[l].distance) {
                                        if ((touches[i].pageX - this.offsetLeft) >= ongoingTimes[i].startX - jkeys.swipes[l].rangeDistance && 
                                            (touches[i].pageX - this.offsetLeft) <= ongoingTimes[i].startX + jkeys.swipes[l].rangeDistance) {
                                            if (jkeys.swipes[l].swipeOnRegion) {
                                                if (((touches[i].pageX - this.offsetLeft) >= jkeys.swipes[l].regionForSwipe.x) &&
                                                    ((touches[i].pageX - this.offsetLeft) <= (jkeys.swipes[l].regionForSwipe.x + jkeys.swipes[l].regionForSwipe.width)) &&
                                                    ((touches[i].pageY - this.offsetTop) >= jkeys.swipes[l].regionForSwipe.y) &&
                                                    ((touches[i].pageY - this.offsetTop) <= (jkeys.swipes[l].regionForSwipe.y + jkeys.swipes[l].regionForSwipe.height))) {
                                                    
                                                    jkeys.swipes[l].swiped = true;
                                                    jkeys.swipes[l].swipedTime = new Date().getTime();
                                                } // END INSIDE REGION CHECK 
                                            }// END swipeOnRegion CHECK
                                            else {
                                                jkeys.swipes[l].swiped = true;
                                                jkeys.swipes[l].swipedTime = new Date().getTime();    
                                            }
                                        } // END X RANGE DISTANCE CHECK
                                        
                                    } // END Y RANGE DISTANCE CHECK
                                    
                                } // END ORIGIN CHECK
                                
                            } // END VE '+' CHECK
                            
                            if (jkeys.swipes[l].ve == '-') {
                                if ((touches[i].pageY - this.offsetTop) > ongoingTimes[i].startY) {
                                    if (((touches[i].pageY - this.offsetTop) - ongoingTimes[i].startY) >= jkeys.swipes[l].distance) {
                                        if ((touches[i].pageX - this.offsetLeft) >= ongoingTimes[i].startX - jkeys.swipes[l].rangeDistance && 
                                            (touches[i].pageX - this.offsetLeft) <= ongoingTimes[i].startX + jkeys.swipes[l].rangeDistance) {
                                            if (jkeys.swipes[l].swipeOnRegion) {
                                                if (((touches[i].pageX - this.offsetLeft) >= jkeys.swipes[l].regionForSwipe.x) &&
                                                    ((touches[i].pageX - this.offsetLeft) <= (jkeys.swipes[l].regionForSwipe.x + jkeys.swipes[l].regionForSwipe.width)) &&
                                                    ((touches[i].pageY - this.offsetTop) >= jkeys.swipes[l].regionForSwipe.y) &&
                                                    ((touches[i].pageY - this.offsetTop) <= (jkeys.swipes[l].regionForSwipe.y + jkeys.swipes[l].regionForSwipe.height))) {
                                                    
                                                    jkeys.swipes[l].swiped = true;
                                                    jkeys.swipes[l].swipedTime = new Date().getTime();
                                                } // END INSIDE REGION CHECK 
                                            }// END swipeOnRegion CHECK
                                            else {
                                                jkeys.swipes[l].swiped = true;
                                                jkeys.swipes[l].swipedTime = new Date().getTime();    
                                            }
                                        } // END X RANGE DISTANCE CHECK
                                        
                                    } // END Y RANGE DISTANCE CHECK
                                    
                                } // END ORIGIN CHECK
                                
                            } // END VE '-' CHECK
                            
                        } // END VERTICAL CHECK
                    }
                }
                
                // Handle REGIONS
                
                for (var j = 0; j < jkeys.regions.length; j++) {
                    
                    // Still Inside The Region
                    if (((touches[i].pageX - this.offsetLeft) > jkeys.regions[j].x) &&
                        ((touches[i].pageX - this.offsetLeft) <= (jkeys.regions[j].x + jkeys.regions[j].width))) {
                        
                        if (((touches[i].pageY - this.offsetTop) > jkeys.regions[j].y) &&
                            ((touches[i].pageY - this.offsetTop) <= (jkeys.regions[j].y + jkeys.regions[j].height))) {
                                jkeys.regions[j].unpress();
                        }
                        
                    }
                    
                    // Left The Region Space
                    if (((touches[i].pageX - this.offsetLeft) < jkeys.regions[j].x) &&
                        ((touches[i].pageX - this.offsetLeft) > (jkeys.regions[j].x + jkeys.regions[j].width))) {
                        
                        if (((touches[i].pageY - this.offsetTop) < jkeys.regions[j].y) &&
                            ((touches[i].pageY - this.offsetTop) >= (jkeys.regions[j].y + jkeys.regions[j].height))) {
                                jkeys.regions[j].unpress();
                        }
                    }
                    
                }
                    
                // Handle Buttons
				for (var j = 0; j < jkeys.keys.length; j++) {
					if (touches[i].pageX - this.offsetLeft > jkeys.keys[j].drawnAtX && touches[i].pageX - this.offsetLeft <= jkeys.keys[j].drawnAtX + jkeys.keys[i].spriteWidth &&
						touches[i].pageY - this.offsetTop > jkeys.keys[j].drawnAtY && touches[i].pageY - this.offsetTop <= jkeys.keys[j].drawnAtY + jkeys.keys[i].spriteHeight) {
						jkeys.keys[j].leave();
					}
				}
                
                // Handle Objects
                
                for (var j = 0; j < jkeys.objectPool.length; j++) {
                    if (jkeys.objectPool[j].isHeld) {
                        jkeys.objectPool[j].moveTo((touches[i].pageX - this.offsetLeft), (touches[i].pageY - this.offsetTop));
                        jkeys.objectPool[j].isHeld = false;
                    }
                }
                
                
				
				ctx.moveTo(ongoingTouches[idx].pageX - this.offsetLeft, ongoingTouches[idx].pageY - this.offsetTop);
				ongoingTouches.splice(idx, 1);  // remove it; we're done
                ongoingTimes.splice(idx, 1);
			} else {
//				log("can't figure out which touch to end");
			}
		}
	};
	
	function handleCancel(evt) {
		evt.preventDefault();
		var touches = evt.changedTouches;
		
		for (var i=0; i < touches.length; i++) {
			ongoingTouches.splice(i, 1);  // remove it; we're done
		}
	};
	
	/* SUPPORT FUNCTONS */
	
	function colorForTouch(touch) {
		var r = touch.identifier % 16;
		var g = Math.floor(touch.identifier / 3) % 16;
		var b = Math.floor(touch.identifier / 7) % 16;
		r = r.toString(16); // make it a hex digit
		g = g.toString(16); // make it a hex digit
		b = b.toString(16); // make it a hex digit
		var color = "#" + r + g + b;
		return color;
	};
	
	function copyTouch(touch, s) {        
		return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY, startTime: s };
	};
	
	function ongoingTouchIndexById(idToFind) {
		for (var i=0; i < ongoingTouches.length; i++) {
			var id = ongoingTouches[i].identifier;
			
			if (id == idToFind) {
				return i;
			}
		}
		
		return -1;    // not found
	};
	
	function log(msg) {
		var p = document.getElementById('log');
		p.innerHTML = msg + "\n" + p.innerHTML;
	};
	
	function onTouch(evt) {
		evt.preventDefault();
		
		if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
			return;
		
		var newEvt = document.createEvent("MouseEvents");
		var type = null;
		var touch = null;
		
		switch (evt.type) {
			case "touchstart":
				type = "mousedown";
				touch = evt.changedTouches[0];
			break;
			case "touchmove":
				type = "mousemove";
				touch = evt.changedTouches[0];
			break;
			case "touchend":
				type = "mouseup";
				touch = evt.changedTouches[0];
			break;
		}
		
		newEvt.initMouseEvent(type, true, true, evt.originalTarget.ownerDocument.defaultView, 0, 
			touch.screenX, touch.screenY, touch.clientX, touch.clientY, touch.startTime = 0,
			evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
		
		evt.originalTarget.dispatchEvent(newEvt);
	};


// RESOUCE LOADER
(function() {
	
	var resourceCache = {};
	var loading = [];
	var readyCallbacks = [];
	
	// Load an image url or an array of image urls
	
	function load(urlOrArr) {
		if(urlOrArr instanceof Array) {
			urlOrArr.forEach(function(url) {
				_load(url);
			});
		} else {
			_load(urlOrArr);
		}
	}

	function _load(url) {
		if(resourceCache[url]) {
			return resourceCache[url];
		} else {
			var img = new Image();
			img.onload = function() {
				resourceCache[url] = img;
				if(isReady()) {
					readyCallbacks.forEach(function(func) { func(); });
				}
			};
		
			resourceCache[url] = false;
			img.src = url;
		}
	}
	
	function get(url) {
		return resourceCache[url];
	}
	function isReady() {
		var ready = true;
		
		for(var k in resourceCache) {
			if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
				ready = false;
			}
		}
		
		return ready;
	}


	function onReady(func) {
		readyCallbacks.push(func);
	}


	window.resources = {
		load: load,
		get: get,
		onReady: onReady,
		isReady: isReady
	};
	
})();
