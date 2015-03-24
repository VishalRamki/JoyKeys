JoyKeys - A Javascript Library For Touch-Based Controls
=======================================================

JoyKeys is a javascript library used to provide a user with the ability to create and manage on-screen joypads, as well as manage touch-based regions and swiping mechanisms. 

JoyKeys is based on the Mozilla Multi-Touch code.

JoyKeys provide constructors for building a JoyPad out of Sprite-based buttons, using particular regions on screen and just making use of the standard swiping functions. 

JoyKeys also allows you to Swipe Only Within Particular Regions.

Initilizing JoyKeys
-------------------

JoyKeys does not require a massive amount of set up, though due to slight work-arounds I used when developing it initally, they exists some extra steps which aren't very hard to complete.

JoyKeys is already created once you import joykeys.js or joykeys.min.js, you don't need to declare a new instance of the object. The JoyKeys object is found within the parameter 'jKeys'.

### Setting Up JoyKeys

To create the on screen buttons you will first need to load your image data. The image data should be loaded before the init() function is called. `Resources` is a script that I pulled from the internet, I can't remember the person who wrote it as I got it months ago, but that code belongs to them.

```javascript
resources.load([
    'basic/arrowUp.png',
	'basic/arrowDown.png',
	'basic/arrowLeft.png',
	'basic/arrowRight.png',
	'basic/buttonA.png',
	'basic/buttonB.png',
	'basic/buttonX.png',
	'basic/buttonY.png'
]);
```

Once you have completed the loading you can then use any of the images you've loaded inside of your Button objects. 

For example to bind  `'basic/arrowUp.png'` to your Up object just call `basic/arrowUp.png` inside the `fileURL` parameter.

Now that images are loaded you have to call the Init Function to build your touch objects.

Note that you don't need to load any image data to initilize Swipes and Regions. You may Call `resources.onReady` with `init()` and an empty load array, everything will be fine.

```javascript
resources.onReady(init); // init is just a skeleton, you can create your own init functon
```
Now that you are ready to begin creating your own interative keys, regions and swipes.

The skeleton init function is as follows;

```javascript
var init = function () {

    var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

    jkeys.debug = true; // or false your choice

    /*
        ... You Interactive Data Here
    */

    jkeys.isReady = true; // this tells your engine to start testing for JoyKeys Data
    startup(); // this is needed to call the Touch Event Listeners

};
```

The Previous three blocks of code can be placed anywhere. Since `jkeys` is global. (See Basic Running Example)


You can of course create your objects in any way you'd like, I prefer to create them in-line, especially when their pointers are being handled by another function.

#### Using Buttons

To Create a button, you merely call the `new Button(OPTIONS)` constructor.

```javascript
[Button] Options = {
    "fileUrl": 'basic/arrowUp.png', // Should be the same url as the one loaded inside the resources.load
    "height": 50, // Height of Button
    "width": 50, // Width of Button
    "drawX": 100, // X-pos at which to draw Button
    "drawY": 100, // Y-pos at which to draw Button
    "nameIdentity": "Up", // Name Of The Object
    "canvasContext": context // Context On Which To Draw The Object **MUST HAVE
}

```

Once you have assigned your `new Button()` Object to a variable you can proceed to add it to JoyKeys Pool using:

```javascript
jkeys.addKey(YOUR_BUTTON_VAR_HERE);
```

Or if you want you may create it in-line:

```javascript
jkeys.addKey(new Button({
    ...
}));
```

#### Using Regions

Regions are created just like buttons by calling the `new Region(OPTIONS)` Constructor.

```javascript
[Region] Options = {
    "name": "big6",
    "xOrigin": 150,
    "yOrigin": 150,
    "regionWidth": 200,
    "regionHeight": 300,
    "canvasContext": context
}
```

Regions are bound to JoyKeys in a similar fashion as The Buttons except you bind it using `jkeys.addRegion(YOUR_REGION_HERE);`.


#### Using Swipes

To use the swipe function in JoyKeys, you will need to build your individual swipes.

Swipe has the following editable Options:

```javascript
[Swipe] Options = {
    "ident": "Up", // Identifier For Swipe
    "distance": 100, // distance in pixels for the swipe to fire
    "time": 200, // time taken to move the required distance
    "vertical": true, // tells the object if we are checking against Y axis, defaults to FALSE, if not specified
    "horizontal": false, // tells the object if we are checking against X axis, defaults to FALSE, if not specified
    "swipeOnRegion": false, // tells the object if we can only swipe when inside a particular region DEFAULTS TO FALSE, if not specified
    "region": null, // Tells the object which regions it is bound to DEFAULTS TO NULL, if not specified
    "ve": "+", // tells the object if we are checking for positive change or negative change. You MUST Specify either '+' or '-' 
    "rangeDistance": 50, // tells the object horizontal range when checking for vertical swipes and vice versa. DEFAULTS TO 50 px, if not specified.
    "functiontime": 100 // in ms. This tells JoyKeys how long to keep the Swipe set to TRUE. After this time has elapsed the swipe is set to FALSE.
}
```

This was done so that you have complete control over the weight of your swipes. JoyKeys does not come pre-built with Swipes. You will have to specify your own data. You should experiment with the distance + time options. They should be balanced. Too large of either and your swipes will become unresponsive.

Swipes are bound to JoyKeys just like the previous Regions and Keys. Use: `jkeys.addSwipe(YOUR_SWIPE_HERE);`

### Using Your Built Interactions 

Each Key, Region and Swipe maybe called using its respective get function, which returns either the actual OBJECT or NULL if it can't be found. 

```javascript
[Key] jkeys.getKey(STRING_ID_HERE)::BUTTON
[Region] jkeys.getRegion(STRING_ID_HERE)::REGION
[Swipe] jkeys.getSwipe(STRING_ID_HERE)::SWIPE
```

That's for if you're peforming operations on the objects themselves. To Test Whether or not it is pressed, you access the press vars, which is a boolean.

```javascript
[Key] jkeys.getKey(STRING_ID_HERE).isPressed::BOOLEAN
[Region] jkeys.getRegion(STRING_ID_HERE).isPressed::BOOLEAN
[Swipe] jkeys.getSwipe(STRING_ID_HERE).swiped::BOOLEAN
```

### Examples of Use

Say you have Built a JoyPad of directional keys. They Are stored inside the "Up", "Down", "Left", "Right" Objects.

To Use these Objects to move your character, which is stored in `character`.

```javascript
if (jkeys.getKey("Up").isPressed) {
    character.moveUp();
}
if (jkeys.getKey("Down").isPressed) {
    character.moveDown();
}
if (jkeys.getKey("Left").isPressed) {
    character.moveLeft();
}
if (jkeys.getKey("Right").isPressed) {
    character.moveRight();
}
```

Now that our character can move around say, you want to use a region to bring up the inventory. So you have your inventory stored in the `inventory` object.

```javascript
if (jkeys.getRegion("inventoryFrame").isPressed) {
    inventory.show();
}
```

You may have other code to exit the `inventory` as you see fit. Not only that but say you've selected a weapon and now you want to attack. So you close your inventory and you have a `"Right"` swipe object. Once we swipe right it activates for 100ms.

```javascript
if (jkeys.getSwipe("Right").swiped) {
    character.attack();
}
```

NOTE WELL: You should Enclose all of your call commands inside a `if (jkeys.isReady)` this ensures all the code and images are loaded up.

And with that you have seen all the basic how-tos of the code. I wish you the best of luck in using this small library I've built and on your future endevours.

### Copyright/License

This is my first ever code library/plug-in.

This code is based ontop of the Mozilla Multi-touch code. `Resources` is code I had picked up a while back for a project, and I've been using it. I can't remember who it belongs to, but it certainly belongs to that person. 

I'm not sure what License to release this under.  (?) I really don't.

Most of the code was written by me, Vishal Ramkissoon.
