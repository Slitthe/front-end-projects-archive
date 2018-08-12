	//Selector variables
var containerElement = document.querySelector(".container.colors-container");
var easyButton = document.querySelector("#easy");
var hardButton = document.querySelector("#hard");
var resetButton = document.querySelector("#reset");
var header = document.querySelector("#header");
var winningText = document.querySelectorAll(".winning-rgb-text");
var gameResultDisplay = document.querySelector("#game-result");
var customHiddenContainer = document.querySelector(".hidden-hover");
var customHiddenButton = document.querySelector("#custom-button");

//other variables
var gameOver = false;
	// Can set how many tiles easy mode and hard should be
var easyMode = 3;
var hardMode = 6;
var currentMode = easyMode; //change starting difficulty
//empty containers for elements and winner color
var elementsList;
var winnerRGB = "";

// Random rgb color generator, in this format: "rgb(random, random, random)""
function rgbColor() {
	'use strict';
	function random() {
		return Math.floor((Math.random() * 256));
	}
	var rgbValue = "rgb(" + random() + ", " + random() + ", " + random() + ")";
	return rgbValue;
}

// Object constructor for each individual color boxes
var Colors = function (winner, index) {
	'use strict';
	this.rgb = rgbColor();
	this.isWinner = winner;
	this.index = index;
	this.setId = function () {this.element.setAttribute("id", this.index); };
	this.setBackground = function () {this.element.style.background = this.rgb; };
	this.content = "<div class=\"color\"></div>";
	containerElement.innerHTML += this.content;
};

// Function which completes the creation of the color object, generating a variable amount of objects, based on howMany parameter
function completedElements(howMany) {
	'use strict';
	var newElements = [];
	var randomNumber = Math.floor(Math.random() * howMany);//determine the winner color
	containerElement.innerHTML = "";//acts as a reset each time a set of elements is created
	for (var i = 0; i < howMany; i++){
		// Only sets one of the objects as the winning one
		if (i !== randomNumber){
			newElements.push(new Colors(false, i));
		}
		else {
			newElements.push(new Colors(true, i));
			winnerRGB = newElements[i].rgb;
		}
	}
	var selectedElements = document.querySelectorAll(".color");//select the color tiles after their creation

	for (var i = 0; i < howMany; i++){
		newElements[i].element = selectedElements[i]; //setting the .element property to be the correct value
		newElements[i].setBackground(); // after the selector is created, sets the bg color to be that from the random generator (which is already a property of the color object)
		newElements[i].setId(); //Gives each object an unique id represending the index


	}

	return newElements;//return the array of color tiles objects
}

//sets the bg color of all the color elements to be that of the winning element(and the header as well)
function onWin (){
	for (var i = 0; i < elementsList.length; i++){
		elementsList[i].rgb = winnerRGB;
		elementsList[i].setBackground();
	}
		header.style.background = winnerRGB;
}

// resets the background color of the header and the winning/lossing message 
function reset (){
	header.style.background = "";
	gameResultDisplay.textContent = "";
}

//adds events listeners to each individual array item (represented by an selected html element)
function addListener (elementsList){
	for (var i = 0; i < elementsList.length; i++){

		elementsList[i].element.addEventListener("click", function(){
			var index = Number(this.getAttribute("id")) ;
			// nothing runs if gameOver is true
			if (!gameOver){
				// what happens if the winning color is clicked
				if(elementsList[index].isWinner){
					gameResultDisplay.innerHTML = "<span id=\"pick-winner\">You Won</span>";
					gameOver = true;
					onWin();//runs the bg color changer function
			}
				else {
					// what Happens if the losing button is clicked
					gameResultDisplay.innerHTML = "<span id=\"pick-loser\">Wrong Pick</span>";
					setTimeout(function(){
						if (!gameOver){//Prevents a bug where the winning text would dissapear right after you clicked the wrong one
							gameResultDisplay.innerHTML = "";
						}
						}, 1500); //makes the losing message dissapear after 1.5s
						this.style.background = "transparent";
					}
			}
			
		}); //End of addEventListener
	}
}

// uses the previous functions (addListener(), completedElements() and the constructor functions to create a new instance of the game session)
// this will run on reset,easy and hard buttons
// howMany means how many tiles are to be displayed
function newGame (howMany){
	reset ();
	gameOver = false;
		//create the objects and adding listeners to each object's coresponding element
	elementsList = completedElements(howMany);
	addListener(elementsList);
		//visual toggle to indicate which mode is currently at play, hard or easy, updating according to easyMode and hardMode values
	if (howMany === easyMode){
		easyButton.classList.add("active");
		hardButton.classList.remove("active");
	}
	else if (howMany === hardMode){
		easyButton.classList.remove("active");
		hardButton.classList.add("active");
	}
	winningText[0].textContent = winnerRGB;
	winningText[1].textContent = winnerRGB;
}

	// running the function above once at the start of the page to create a new game instance, delete to NOT start a new game instance when the page first loads
newGame(currentMode);


// Button event listeneres, used a function to be able to use custom easy and hard mode values, see code right below this function
function buttonEventListeners (){
	easyButton.addEventListener("click", function(){
		newGame(easyMode);
		currentMode = easyMode;
	});

	hardButton.addEventListener("click", function(){
		newGame(hardMode);
		currentMode = hardMode;
	});


	resetButton.addEventListener("click", function(){
		reset();
		newGame(currentMode);
		this.classList.add("active");
		setTimeout(function(){
			resetButton.classList.remove("active");
		},500);
	});
}
buttonEventListeners();


// Custom mode buttons and listeners
var customEasyButton = document.querySelector("#custom-easy-mode");
var customHardButton = document.querySelector("#custom-hard-mode");

customEasyButton.addEventListener("input", function(){
	easyMode = Number(this.value);
	buttonEventListeners();
});
customHardButton.addEventListener("input", function(){
	hardMode = Number(this.value);
	buttonEventListeners();
});

customHiddenButton.onclick = function (){
	customHiddenContainer.classList.toggle("hide-and-show");
	this.classList.toggle("pressed-active");
};

// Display the winning rgb when you scroll down the page
setInterval(function(){
	if(window.pageYOffset > 240){
		winningText[1].style.display = "block";
	}
	else {
		winningText[1].style.display = "none";

	}
}, 1500);
