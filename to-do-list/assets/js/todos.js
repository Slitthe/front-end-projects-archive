// creates single "li" item
// input: an object with two props: "completed" (bool) and "text"
function createElement (obj) {
	var result = "<li ";
	var completedClass;

	if (obj.completed) {
		result += "class=\"completed\"";
	}

	result += "><span><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span>";
	result += obj.text;
	result += "<div class=\"check\"><input type=\"checkbox\"";
	if (obj.completed) {
		result += "checked";
	}
	result += " ><span></span></div></li>";
	return $(result); // returns it as a jQuery
}

// stores the info necessary to construct the list items in localStorage
function storeElements () {
	var convertedEls = [];
	var elementsList = $("li");
	for (var i = 0; i < elementsList.length ; i++) { //loops through the elements list
		convertedEls.push(new Object());
		// uses "nth-of-type" selector to loop through the jQuery elements
		convertedEls[i]["completed"] = $("li:nth-of-type(" + (i + 1) + ")").hasClass("completed");
		convertedEls[i]["text"] = $("li:nth-of-type(" + (i + 1) + ")").text();

	}
	// stores the result as an array of objects
	localStorage.list = JSON.stringify(convertedEls);
}

// checks for the existence of localObject property
if (localStorage.hasOwnProperty("list")){
	$("ul").html(""); // clears the default (placeholder)
	var elements = JSON.parse(localStorage.list);
	// loops through the localStorage list object and using the "createElement" function, reconstructs the saved list
	for (var i = 0 ; i < elements.length ; i++) {
		$("ul").append(createElement(elements[i]));
	}
}


	/* ========Event Listeners============ */
// --- Entering a new element ---
$("input[type='text']").keypress(function(e){
	if (e.which === 13) { // Check for enter key
		// creates a new list item using "createElement" function
		var element = createElement({completed: false, text: $(this).val()});
		$("ul").append(element); // Appends the element to the "ul"
		element.css("display", "none");
		element.fadeIn();
		$(this).val(""); // Clears the input value
		storeElements(); // Updates localStorage
	}
});

// ---Marking completed elements---
$("ul").on("click","li", function(){
	$(this).toggleClass("completed"); // Toggle the "completed" class on the clicked li
	// Toggle the "checked" property on the checkbox
	if ($(this).children(".check").children("input").prop("checked")) {
		$(this).children(".check").children("input").prop("checked", false);
	}
	else {
		$(this).children(".check").children("input").prop("checked", true);
	}
	storeElements(); // Updates the elements into the localStorage
});

// ----List item remove -----
$("ul").on("click","li > span", function(e){
	e.stopPropagation(); // prevents the li listener from triggering
	$(this).parent().fadeOut(300, function(){
		$(this).remove();
		storeElements(); // update the localStorage after the element is removed
	});
});

// Input show/hide
$("h1 .fa").click(function(){
	$("input[type=\"text\"]").fadeToggle(200);
	$(this).toggleClass("fa-minus");
});
