// corresponding key/sound for every letter keyboard key
var keySound = {
	q: {color: "red", sound: new Howl({ src: ["assets/audio/bubbles.mp3"], volume: 0.5 }) },
	w: {color: "olive", sound: new Howl({ src: ["assets/audio/confetti.mp3"], volume: 0.5 }) },
	e: {color: "grey", sound: new Howl({ src: ["assets/audio/corona.mp3"], volume: 0.5 }) },
	r: {color: "aqua", sound: new Howl({ src: ["assets/audio/dotted-spiral.mp3"], volume: 0.5 }) },
	t: {color: "purple", sound: new Howl({ src: ["assets/audio/flash-1.mp3"], volume: 0.5 }) },
	y: {color: "navy", sound: new Howl({ src: ["assets/audio/timer.mp3"], volume: 0.5 }) },
	u: {color: "yellow", sound: new Howl({ src: ["assets/audio/ufo.mp3"], volume: 0.5 }) },
	i: {color: "LimeGreen", sound: new Howl({ src: ["assets/audio/prism-2.mp3"], volume: 0.5 }) },
	o: {color: "Khaki", sound: new Howl({ src: ["assets/audio/piston-1.mp3"], volume: 0.5 }) },
	p: {color: "LightSteelBlue", sound: new Howl({ src: ["assets/audio/prism-3.mp3"], volume: 0.5 }) },
	a: {color: "Sienna", sound: new Howl({ src: ["assets/audio/wipe.mp3"], volume: 0.5 }) },
	s: {color: "Coral", sound: new Howl({ src: ["assets/audio/zig-zag.mp3"], volume: 0.5 }) },
	d: {color: "PeachPuff", sound: new Howl({ src: ["assets/audio/veil.mp3"], volume: 0.5 }) },
	f: {color: "Tan", sound: new Howl({ src: ["assets/audio/splits.mp3"], volume: 0.5 }) },
	g: {color: "Burlywood", sound: new Howl({ src: ["assets/audio/piston-2.mp3"], volume: 0.5 }) },
	h: {color: "SkyBlue", sound: new Howl({ src: ["assets/audio/flash-3.mp3"], volume: 0.5 }) },
	j: {color: "DeepSkyBlue", sound: new Howl({ src: ["assets/audio/moon.mp3"], volume: 0.5 }) },
	k: {color: "LawnGreen", sound: new Howl({ src: ["assets/audio/strike.mp3"], volume: 0.5 }) },
	l: {color: "Orange", sound: new Howl({ src: ["assets/audio/pinwheel.mp3"], volume: 0.5 }) },
	z: {color: "Turquoise", sound: new Howl({ src: ["assets/audio/squiggle.mp3"], volume: 0.5 }) },
	x: {color: "OrangeRed", sound: new Howl({ src: ["assets/audio/piston-3.mp3"], volume: 0.5 }) },
	c: {color: "Peru", sound: new Howl({ src: ["assets/audio/suspension.mp3"], volume: 0.5 }) },
	v: {color: "Gold", sound: new Howl({ src: ["assets/audio/glimmer.mp3"], volume: 0.5 }) },
	b: {color: "OliveDrab", sound: new Howl({ src: ["assets/audio/flash-2.mp3"], volume: 0.5 }) },
	n: {color: "Teal", sound: new Howl({ src: ["assets/audio/prism-2.mp3"], volume: 0.5 }) },
	m: {color: "DarkCyan", sound: new Howl({ src: ["assets/audio/clay.mp3"], volume: 0.5 }) }
};

// empty cirles array;
var circles = [];


// onKeyDown is an an event function from paper.js
function onKeyDown (event) {
	// only run the code for the keys present in the "keySound" object to prevent undefined errors
	if (keySound.hasOwnProperty(event.key)){
		var point = Point.random();
		point.x = point.x * view.size.width;
		point.y = point.y * view.size.height;
		var circle = new Path.Circle(point, 300)
		var key = event.key;
		
		circle.fillColor = keySound[key].color;
		keySound[key].sound.play();
		circles.push(circle);
	}
}

// the animation function from paper.js, it runs 60 times/second
function onFrame(){
	// apply the animation for all the circles in the circles array
	for (var i = 0 ; i < circles.length ; i++){
		circles[i].fillColor.hue -= 2;
		circles[i].scale(0.92);	
	}
	// Removes the circles who's area is less than 0
	circles = circles.filter(function(element){
		return element.area > 0;
	});
}


