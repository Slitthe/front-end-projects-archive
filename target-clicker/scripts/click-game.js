 /*---Selectors and variables---*/
var gameArea = document.getElementById("game-area");
var targetsContainer = document.getElementById("targets-container");
var targets = document.getElementsByClassName("target");
var btnResultsContainer = document.getElementById("btn-results-container");
var newGameBtn = document.getElementById("new-game-btn");
var resultsDisplay = document.getElementById("results-display");
var countdownDisplay = document.getElementById("countdown");
var accuracyDisplay = document.querySelector("#accuracy-display span");
var accuracyBarHits = document.getElementById("accuracy-bar-hits");
var accuracyBarFails = document.getElementById("accuracy-bar-fails");
var gameDurationBar = document.getElementById("game-duration-bar");
var hearts = document.querySelectorAll("#lives-container .heart");
var bulletPointer = document.getElementById("bullet-pointer");
var gunPointer = document.getElementById("gun-pointer");
var modeButtons = document.getElementById("modes-btn-container");
var instructionsBtn = document.getElementById("instructions-close");
var instructionsContainer = document.getElementById("instructions");
var easyBtn = document.querySelector("#easy-btn");
var mediumBtn = document.querySelector("#medium-btn");
var hardBtn = document.querySelector("#hard-btn");
var score = 0;
var totalCorrectTargets = 0;
var currentCorrectTargets = 0;
var currentWrongHits = 0;
var gameRunCounter = 0;
var targetsArray = [];
var currentAccuracy = 0;
var noMoreLives = false;
var nextLevel = true;
var gameOver = false;
/*---End of Selectors and Variables---/*


/*Difficulty modes and its buttons*/
	// Difficulty modes constructor function
function Modes(totalTargets, timeStart, timeLimit, timeDifference, animStart, animLimit, animDifference, modeName, percentageScaling) {
	"use strict";
	// Sets the difficulty levels
	this.totalTargets = totalTargets;
	this.timeStart = timeStart;
	this.timeLimit = timeLimit;
	this.timeDifference = timeDifference;
	this.animStart = animStart;
	this.animLimit = animLimit;
	this.animDifference = animDifference;
	this.modeName = modeName;
	this.percentageScaling = percentageScaling;
	this.level = 1;
	this.lastLevel = 1;
}

	// Difficulty modes variables
var easyMode = 	 new Modes(40, 700, 275, 10, 3.5,   1.65, 0.04, "Easy", 0.99);
var mediumMode = new Modes(40, 650, 265, 11, 3,   1.61, 0.03, "Medium", 0.985);
var hardMode = 	 new Modes(40, 400, 150, 14, 2.1, 1.47, 0.02, "Hard", 0.97);
var currentMode = JSON.parse(JSON.stringify(easyMode)); // sets the default starting mode

	// Used to make the pressed button have the "active" class
function onlyOneClass(addClassElement, removeClassElements, htmlClass) {
	"use strict";
	addClassElement.classList.add(htmlClass);
	for (var i = 0 ; i < removeClassElements.length ; i ++){
		removeClassElements[i].classList.remove(htmlClass);
	}
}

	// Difficulty modes event listeners, used to change the "currentMode" variable as well as make only that clicked element have the "active" class
easyBtn.addEventListener("click",function(){
	currentMode = easyMode;
	onlyOneClass(easyBtn, [mediumBtn, hardBtn], "active");
});

mediumBtn.addEventListener("click",function(){
	currentMode = mediumMode;
	onlyOneClass(mediumBtn, [easyBtn, hardBtn], "active");
});

hardBtn.addEventListener("click",function(){
	currentMode = hardMode;
	onlyOneClass(hardBtn, [easyBtn, mediumBtn], "active");
});

	// returns a mode object based on the input, used to reset the currentMode
function resetModes (modeName) {
	if (modeName === "Easy"){
		return easyMode;
	}
	else if (modeName === "Medium"){
		return mediumMode;
	}
	else if (modeName === "Hard"){
		return hardMode;
	}
}
/*---End of Difficulty modes and its buttons---*/


/*Instructions*/
	// Hides the instructions upon clicking the "Hide Instructions" button
instructionsBtn.onclick = function () {
	this.classList.add("bottom-radius-only");
	instructionsContainer.style.bottom = "100%";
	setTimeout(function(){
		instructionsContainer.style.display = "none";
	},800); // sync this with css transition-duration
};
/*---End of instructions---*/


/*New Game Creation*/
	// Creates a new game instance
function startNewGame () {
		// resets the game ; hides previous elements (prevent a bug) ; starts the countdown ; creates blank targets ;  sort targets ; waits 4s (for countdown), then starts the game by starting gameRun function and starts the updateProgressBars function
	reset();
	hideElements(targets);
	countdown();
	createBlankTargets(currentMode.totalTargets);
	sortTargets(targets, 0.5); // Use 0-1 to set the random percentages of "good" targets; 0-0%, 1-100%
	setTimeout(function() {
		gameRun(currentMode.timeStart);
		gunPointer.style.display = "block";
		updateProgressBars();
	}, 4000);
}

	// Game start button -- initializes a new game
newGameBtn.onclick = function () {
	startNewGame();
};
/*---End of New Game Creation---*/


/*Targets creation*/
	// Creates a random integer between min(inclusive) and max(exclusive), used to place the targets randomly
function randomRange(min, max) {
	return Math.floor((Math.random() * (max - min )) + min);
}

	// Creates a (blank --> see "sortTargets" function) new game instance
function createBlankTargets (howMany) {
	for (var i = 1 ; i <= howMany ; i++){ // Create the number of targets specificed in the currentMode.totalTargets property
		targetsContainer.innerHTML += "<div class=\"target\"></div>";
	}

	// Loops through the created targets elements
	for (var i = 0 ; i < targets.length ; i++){
		targetsArray.push(targets[i]); // Pushes the targets elements onto an array (for later usage: see "gameRun" function)
		// Gives it a random positioning in the game
		// Modify these 2 properties to align the targets in dfferent places on the targets container
		targets[i].style.left = randomRange(10,90) + "%";
		targets[i].style.top = randomRange(6, 75) + "%";

		targets[i].addEventListener("click", function(){ // events listeners for targets
			// Hide the element upon click
			this.style.display = "none";
			if (this.classList.contains("correct-target")) { // if its the right target increases the score
				score++;
			}
			else { // if its the wrong one increase the wrong ones count and deletes one heart
				currentWrongHits++;
				deleteHearts(currentWrongHits);
			}
		});
	} // End of for
}

	// Used to sort the recently created elements to "good" and "bad" targets
function sortTargets (blankTargets, percentages) {
	for (var  i = 0 ; i < blankTargets.length ; i++){ // Loops through the input elements
		if (Math.random() > percentages){ // makes around 50% of the targets be normal targets
			blankTargets[i].classList.add("correct-target");
			totalCorrectTargets++; // On the creation of a correct target, increases the count of the variable, to know how many total correct targets there are, to be able to show the results at the end of the game
		}
		else { // the other ~ 50% of the targets are ducks
			blankTargets[i].classList.add("wrong-target");
		}
	}
}
/*--- End of targets creation --- */


/*Display & Reset*/
	// Resets the variables and display elements
function reset () { // variables and display reset
	if(!nextLevel){ // Reset the currentMode object on game over, using JSON to soft clone the object
		currentMode = JSON.parse(JSON.stringify(resetModes(currentMode.modeName)));
	}
	score = 0;
	targetsArray = [];
	totalCorrectTargets = 0;
	currentWrongHits = 0;
	currentAccuracy = 0;
	gameRunCounter = 0;
	currentCorrectTargets = 1; // Makes it 1 so the accuracy % won't display NaN (because of 0 / 0 division --> see "updateProgressBars" function)
	gameOver = false;
	nextLevel = true;
	noMoreLives = false;

	currentMode.lastLevel = currentMode.level;

	btnResultsContainer.style.display = "none";
	accuracyBarHits.style.width = "0%";
	accuracyBarFails.style.width = "0%";
	targetsContainer.innerHTML = "";
	gameDurationBar.style.width = "0%";
	accuracyDisplay.textContent = "";
	for (var  i = 0 ; i < hearts.length ; i++){
		hearts[i].style.display = "block";
	}
}

	// Pre-game Countdown display
function countdown () {
	countdownDisplay.style.display = "block";
	var countdownTimer = 3;
	var value = setInterval(function(){
		countdownDisplay.textContent = countdownTimer;
		countdownTimer--;
		if (countdownTimer < 0){
			clearInterval(value);
			countdownDisplay.textContent = "";
			countdownDisplay.style.display = "none";
		}
	},1000);
}

	// Starts the live updating game elapsing and accuracy
function updateProgressBars(){ // used to update the hits/fails bars and game progression bar every 500ms (or other specified interval), ends when the game is over
	setInterval(function(){
		if (!gameOver){ // Stops updating once the current game is over
				currentAccuracy = (score / currentCorrectTargets) * 100;
				if (isNaN(currentAccuracy)) { // prevents NaN being display at the start of the game 
					currentAccuracy = 0;
				}
				accuracyDisplay.textContent = Math.round(currentAccuracy) + "%";
				accuracyBarHits.style.width = currentAccuracy + "%";
				accuracyBarFails.style.width = 100 - currentAccuracy + "%";
				gameDurationBar.style.width = ((gameRunCounter ) / targets.length) * 100 + "%"; // Game duration bar
				// Current correct target accuracy (how many targets hit vs how many correct targets have appeared so far)
		}
		else { // Stops the interval

			clearInterval(3);
		}
	}, 500);
}

	// Used to display the results div when you finish a level, either completing it or failing it
function resultText (){
	var winAnswer = "";
	var loseAnswer = "";
	var loseAnswerDucks = "";
	if (nextLevel) { // What to display when finishing a level
		winAnswer = "You completed level" + "<span class=\"results-text\"> " + currentMode.lastLevel + "</span><br>";
		winAnswer +=  "Level accuracy: " + "<span class=\"results-text\">" + String(currentAccuracy).substring(0,4) + "%" + "</span><br>";
		winAnswer += "You hit: " + "<span class=\"results-text\">" + score + " / " + currentCorrectTargets + " </span>" + "targets<br>";
		winAnswer += "You hit: " + "<span class=\"results-text\">" + currentWrongHits + "</span>" + " ducks";

		resultsDisplay.innerHTML =  winAnswer;
	}
	else { // losing a level
		if (noMoreLives) { // by running out of lives
			loseAnswerDucks = "<p class=\"results-text\">Game Over</p>";
			loseAnswerDucks += "<p>You ran out of lives (hit too many ducks)</p>";
			loseAnswerDucks += "<p>Last level completed: <span class=\"results-text\">" + (currentMode.lastLevel - 1) + "</span></p>";

			loseAnswerDucks += "<p>Current Difficulty: <span class=\"results-text\">" + currentMode.modeName + "</span></p>";
			resultsDisplay.innerHTML = loseAnswerDucks;

		}
		else { // by having a hit percentage that's too low
			loseAnswer = "<p class=\"results-text\">Game Over</p>";
			loseAnswer += "<p>Your hit percentages were too low to pass the level. (<span class=\"results-text\">" + String(currentAccuracy).substring(0,4) + "%" + ")</span></p>";
			loseAnswer += "<p>Last level completed: " + "<span class=\"results-text\">" + (currentMode.lastLevel - 1) + "</span></p>";
			loseAnswer += "<p>Current Difficulty: <span class=\"results-text\">" + currentMode.modeName + "</span></p>";
			resultsDisplay.innerHTML = loseAnswer;
		}
	}
	// Hides the poiner
	gunPointer.style.display = "none";
	btnResultsContainer.style.display = "block";
}

	// hides all input elements, used to hide the targets and prevent a bug
function hideElements (elements) {
	for (var i = 0 ; i < elements.length ; i++){
		elements[i].style.display = "none";
	}
}
	// Change the display property of the button groups as well as the text content of the new game button depending on the nextLevel boolean variable's value
function updateButtonsText () {
	if (nextLevel) {
		// if the nextLevel is true, continue to hide the modes buttons and show the "Play Level" text
		modeButtons.style.display = "none";
		newGameBtn.textContent = "Play Level " + currentMode.level;
	}
	else {
		// if the current level is over (thus the game) , shows the modes buttons again and change the text content of the new game button
		modeButtons.style.display = "block";
		newGameBtn.textContent = "Play Again?";
	}
}
/*---End of display & Reset---*/


/*Game running logic*/
		// Main Game running function: using setTimeout to display the targets at the interval specified in the currentMode object
function gameRun (start) { // start: the time in ms at which each started should start appearing after
	setTimeout(function(){
		// only runs when gameOver is false
		if (!gameOver && gameRunCounter < targets.length) { // Because of the setTimeout delay the code would run one more time after the end of the game; the second comparison prevents that
			targets[gameRunCounter].style.display = "block"; // display the current target

			// Adding the animation (the shorthand properties) to the each individual target upon its apparition
			addAnimations ((currentMode.animStart + "s") , "linear", "target", "running");
			currentCorrectTargets = targetsArray.slice(0, gameRunCounter + 1).filter(function(val) {return val.classList.contains("correct-target");}).length; // returns the current total correct targets (to update the accuracy bar accurately)
			gameRunCounter++; // This variables is used to keep track of how many times this function should run (and also to end the game when there are no more targets to display)
			gameRun(start); // calls this function again

			if (gameRunCounter >= targets.length){ // when to end the game
				setTimeout(function(){ // a short delay after the game is over the results text appears (need to account for the time it takes for the last target to dissapear)
					gameOver = true;
					updateModes();
					checkAccuracy((score / currentCorrectTargets) * 100, 75);
					updateButtonsText();
					resultText();
					hideElements(targets);
				}, 4500); // End of setTimeout
			} // end of if (gameRunCount >= targets.length)
		} // if (!gameOver
	},start); // main setTimeout end
} 

	// Adds animations to an element
function addAnimations (duration, timing, name, playState) {
	// Used JavaScript longhand animation properties for better browser compatibility
	targets[gameRunCounter].style.MozAnimation = duration + " " + timing + " 0s normal none 1 " + playState + " " + name + "";
	targets[gameRunCounter].style.webkitAnimation = duration + " " + timing + " 0s normal none 1 " + playState + " " + name + "";
	targets[gameRunCounter].style.msAnimation = duration + " " + timing + " 0s normal none 1 " + playState + " " + name + "";
	targets[gameRunCounter].style.animation = duration + " " + timing + " 0s normal none 1 " + playState + " " + name + "";

	targets[gameRunCounter].style.MozAnimationDuration =  duration;
	targets[gameRunCounter].style.webkitAnimationDuration =  duration;
	targets[gameRunCounter].style.msAnimationDuration =  duration;

	targets[gameRunCounter].style.MozAnimationTimingFunction = timing;
	targets[gameRunCounter].style.webkitAnimationTimingFunction = timing;
	targets[gameRunCounter].style.msAnimationTimingFunction = timing;

	targets[gameRunCounter].style.MozAnimationIterationCount = "1";
	targets[gameRunCounter].style.webkitAnimationIterationCount = "1";
	targets[gameRunCounter].style.msAnimationIterationCount = "1";

	targets[gameRunCounter].style.MozAnimationName = name;
	targets[gameRunCounter].style.webkitAnimationName = name;
	targets[gameRunCounter].style.msAnimationName = name;

	targets[gameRunCounter].style.MozAnimationPlayState = playState;
	targets[gameRunCounter].style.webkitAnimationPlayState = playState;
	targets[gameRunCounter].style.msAnimationPlayState = playState;
}

	// controls the deletion of hearts when the wrong target is hit as well as ending the game if there are no more lives/hearts
function deleteHearts (num){
	var position = num - 1; // because of 0 index
	hearts[position].style.display = "none";
	if (num >= 3){
		gameOver = true; // when gameOver is true gameRun function ds
		noMoreLives = true; // used to display the results text for the running out of lives scenario (vs too low hit percentages)
		nextLevel = false; // signifies that the game is over, that the level is failed
		hideElements(targets);
		setTimeout(resultText, 2500);
		currentMode.level = 1; // reset the level back to one
		updateButtonsText();
	}
}

	// Add a level function:, at the end of each game sessions checks if the curreny Accuracy is higher than 75%, if it is proceeds to the next level
function checkAccuracy (percentages, limit) {
	if (percentages >= limit){
		// increase the current level
		currentMode.level++;
	}
	else {
		// reset the level back to the default value
		currentMode.level = 1;
		nextLevel = false;
	}
}

	// increase the game difficulty if you pass the current level
function updateModes () {
	// the right side expression tells to stop increaseing the difficulty once you reach the difficulty limit for both the time and the animation time
	if (nextLevel && (currentMode.timeStart >= currentMode.timeLimit)){
		currentMode.timeStart -= currentMode.timeDifference;
	}
	else {
		currentMode.timeStart *= currentMode.percentageScaling;
	}
	if (nextLevel && (currentMode.animStart >= currentMode.animLimit)){
		currentMode.animStart -= currentMode.animDifference;
	}
	else {
		currentMode.animStart *= currentMode.percentageScaling;
	}
}
/*---End of Game running logic---*/


/*Pointer and projectile */
	// Rotates an element by the specified degrees
function elementRotate (whatElement, byHowMuch) {
	// Multiple vendor prefixed for better browser compatibility
			whatElement.style.webkitTransform = "rotate(" + byHowMuch + "deg)";
			whatElement.style.msTransform = "rotate(" + byHowMuch + "deg)";
			whatElement.style.MozTransform = "rotate(" + byHowMuch + "deg)";
			whatElement.style.transform = "rotate(" + byHowMuch + "deg)";
}

	// Controls the pointer (gun) when the mouse is moves around the targets area
function mouseFollow (e){
	var x = e.clientX - gameArea.offsetLeft;
	var y = e.clientY - gameArea.offsetTop;
	var xOrigin = this.offsetWidth / 2;
	var yOrigin = this.offsetHeight + 2;
	var xDistance = x - xOrigin;
	var yDistance = y - yOrigin;
	var degrees = Math.atan(yDistance/xDistance) * (180/Math.PI);
	// Gets the x and y coordinates relative to the targets area (by substracting the offsetLet and offsetTop) ; Setting an X and Y origin (at the middle bottom of the game) ; and finding the xDistance and yDistance relative to the origin, to be able to use them to find the required degrees (by using atan (arctan))

	if (degrees < 0){ // because arcsin will only spit out values between 0-90degrees, have to substraction for complementary angles to get the right angle for the pointer bar
		degrees = 90 - Math.abs(degrees);
	}
	else {
		degrees = degrees - 90;
	}
	if (degrees !== -90) { // prevents a bug when placing the mouse the bottom of the targets area in the right side would turn the pointer to the left direction (since atan is 0)
		elementRotate(gunPointer, degrees);
	}
}

	// Controls what happens when you click in the targets area
function bulletShoot (e){
	var x = e.clientX - gameArea.offsetLeft;
	var y = e.clientY - gameArea.offsetTop;
	var xOrigin = this.offsetWidth / 2;
	var yOrigin = this.offsetHeight;
	var xDistance = x - xOrigin;
	var yDistance = y - yOrigin;
	var degrees = Math.atan(yDistance/xDistance) * (180/Math.PI);
	bulletPointer.style.display = "block";
	if (degrees < 0){ // because arctan will only spit out values between 0-90degrees, have to substraction for complementary angles to get the right angle for the pointer bar
		degrees = 90 - Math.abs(degrees);
	}
	else {
		degrees = degrees - 90;
	}

	if (degrees !== -90){ // prevents a bug when placing the mouse the bottom of the targets area in the right side would turn the pointer to the left direction (since atan is 0)
		elementRotate(gunPointer, degrees);
	}
	// Using the pythagorean theorem to find out the projectile distance
	var pythTheorem = Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2);
	var pythTheoremSquared = Math.sqrt(pythTheorem);
	bulletPointer.style.top = -(pythTheoremSquared - gunPointer.offsetHeight) + "px";
	setTimeout(function(){
		bulletPointer.style.display = "none";
		bulletPointer.style.top = -gunPointer.offsetHeight + "px" ;
	}, 75); // the bullet hides after
}

targetsContainer.onmousemove = mouseFollow;
targetsContainer.onclick = bulletShoot;
/*---End of pointer & Projectile---*/
