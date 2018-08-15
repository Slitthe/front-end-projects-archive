
//Variables which contain the different elements
var playerOne = document.getElementById("p1Score")
var playerTwo =document.getElementById("p2Score")
var input = document.getElementById("inputValue")
var playerOneButton = document.getElementById("p1Button")
var playerTwoButton = document.getElementById("p2Button")
var resetButton = document.getElementById("resetButton")
var totalScoreElement = document.getElementById("totalScore")
// Score keeping variables
var playerOneScore = 0;
var playerTwoScore = 0;
var totalScore = 0;

// visually update the values
function update (){
	playerOne.textContent = playerOneScore;
	playerTwo.textContent = playerTwoScore;
	totalScoreElement.textContent = input.value;
	totalScore = Number(input.value);
};


// reset the values and styles
function reset (){
	playerOneScore = 0;
	playerTwoScore = 0;
	totalScore = 0;
	input.value = 0;
	playerOne.classList.remove("winner");
	playerTwo.classList.remove("winner");
	document.querySelector("#winner-alert").textContent = "";
	input.removeAttribute("disabled");
	// using update to visually update the values on the screen
	update();
}

//display the winner alert box 
function displayWinner (winnerName){
	document.querySelector("#winner-alert").innerHTML = "<p class='padding'>" + winnerName + " is the winner.</p>";
}

//event listener, uses the update function each time the value of the input is changed
input.addEventListener("input",function(){
	update();
});

// P1 and P2 button increments
playerOneButton.addEventListener("click", function(){
	//only increment is both the scores are under the final score
	if (playerOneScore < totalScore && playerTwoScore < totalScore){
		playerOneScore++;
	}
	//sets the winner, adding styles and disabling the input
	if (playerOneScore >= 1 && playerOneScore === totalScore){
		playerOne.classList.add("winner");
		displayWinner("Player One");
		input.setAttribute("disabled", "disabled");
	}
	update();

});

playerTwoButton.addEventListener("click", function(){
	if (playerOneScore < totalScore && playerTwoScore < totalScore){
		playerTwoScore++;
	}
	if (playerTwoScore >= 1 && playerTwoScore === totalScore){
		playerTwo.classList.add("winner");
		displayWinner("Player Two");
		input.setAttribute("disabled", "disabled");
	}
	update();

});

// adding the reset function to the reset button
document.getElementById("resetButton").addEventListener("click", reset	
);
