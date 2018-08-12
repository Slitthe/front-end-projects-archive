
// -----NON-DOM Variables -----
var attrNames=["str","int","agi","all_atr","hp","hp_reg","hp_rest","mana","mana_reg","mana_rest","armor","mg_resist","evs_acc","phy_mg_blk_imm","reflect","attk_speed","dmg","crit","life_steal","mg_dmg","aoe_dmg","summs_ills","inv_vision","gold_exp","mv_speed","mobi","disable","cdr","range_inc","activable","toggable","start_item","consumable","home","side","secret","shareable"],
criterias = [], // criterias on which the items are filtered by, empty means no filter and each additional array item is a filter that needs to pass
elementsPerRow = 23,
wholePage = false,
itemsOutput,
checkboxes,
resetBtn,
isTap,
tooltipHideBtn,
mainWrapper,
searchInput,
searchResetBtn,
hideBody,
windowLocation,
inputElements = {},
documentRoot,
filterData = {
	initialItems: function() {
		return JSON.parse(items);
	}
};

items = JSON.stringify(items); // used to refer back to the non-filtered items
filterData.currentItems = filterData.initialItems();


// <-- filters the item list against the list of criterias, only keep those who match all
function filterElements() {
	// filter the original items based on the list of criterias (all of them need to pass in order for the item be be kept)
	filterData.currentItems = filterData.initialItems();
	for(var i = 0; i < criterias.length; i++) {
		filterData.currentItems = filterData.currentItems.filter(function(curr) {
			return curr.categories.indexOf(criterias[i]) >= 0;
		});
	}
}

// checks the current item list against each filter in order to determine which input to disable (when there are no results for that corresponding filter)
function checkOtherFilters(itemList) {
	attrNames.forEach(function(current) {
		// calculates the length of the current elements filtered again against each individual filter
		var currentLength = filterData.currentItems.filter(function(filterCr) {
			return filterCr.categories.indexOf(current) >= 0;
		}).length;

		// Disable filter whose result would be 0 elements
		if(currentLength === 0) {
			inputElements[current].setAttribute("disabled", true); // disable if that filter is useless
		}
		else {
			inputElements[current].removeAttribute("disabled");
		}
	});
}

// Construct and display the items grid
function displayItems(displayElement, currentElements) {
	var htmlString = "", i;
	// add each item
	for(i = 0; i < currentElements.length; i++) {
		htmlString += "<li class=\"item\" data-name=\"" + currentElements[i].itemName + "\">";
		htmlString += "<div class=\"img_container\"><img src=\"img/items/" + currentElements[i].itemName + ".png\"></div>";
		htmlString += "<h3 class=\"item_name font_small\">" + currentElements[i].displayInfo.displayName + "</h3>";
		htmlString += "<div class=\"item_gold\">" + currentElements[i].displayInfo.gold + "</div>";
		htmlString += "<div class=\"faux_button\"></div></li>";
	}
	// Adds the filler items
	for(i = 0; i <= elementsPerRow; i++) {
		htmlString += "<div class=\"filler_item\"></div>";
	}
	// adds the item tooltip
	htmlString += "<div id=\"item_tooltip\" class=\"item_tooltip hide\">Item Display</div>";
	// Adds the whole result to the items container
	displayElement.innerHTML = htmlString;
	itemSearch("item", searchInput);
}

// add tooltip related events
function addEvents() {
	var itemTooltip = document.getElementById("item_tooltip"),
	itemElements = document.getElementsByClassName("item"),
	fullScreenTooltipBtn = document.getElementsByClassName("faux_button"),
	i;
	for (i = 0; i < fullScreenTooltipBtn.length; i++) {
		fullScreenTooltipBtn[i].addEventListener("mouseover", function() {
			if(!wholePage) {
				tooltipDisplay(this.parentElement, itemTooltip, filterData.currentItems);
			}
		});
	}
	// event listeners for each
	for(i = 0; i < fullScreenTooltipBtn.length; i++) {
		fullScreenTooltipBtn[i].addEventListener("click", function(){
			tooltipDisplay(this.parentElement, itemTooltip, filterData.currentItems)
			tooltipShow();			
		});
		fullScreenTooltipBtn[i].addEventListener("mouseout", function() {
			if(!wholePage) {
				itemTooltip.classList.add("hide");
			}
		});
	}
	isTap = false;
	itemTooltip.addEventListener("touchstart", function(evt){
		if(!wholePage) {
   			isTap = true;
		}
	});
	itemTooltip.addEventListener("touchmove", function(evt){
		if(!wholePage) {
   			isTap = false;
		}
	});
	itemTooltip.addEventListener("touchend", function(evt){
		if(!wholePage) {
			if(isTap){
				this.classList.add("hide");
			}
		}
	});
}

// -->> accepts the item name string ; and the array with the item data
// <<-- returns the HTML needed to display the item tooltip based on the individual item information 
function itemInfoDisplay(itemName, itemList) {
	// The order in which to construct the item tooltip
	var order = ["itemIcon", "displayName", "gold", "skills", "info", "attributes", "lore"],
	itemElement, // will hold the "displayInfo" of the item corresponding to the "itemName"
	finalHTML = "", // start of the HTML string
	i; 
	 // find the item based on the "itemName" argument
	for(i = 0; i < itemList.length; i++) {
		if(itemList[i].itemName === itemName) {
			itemElement = itemList[i].displayInfo;
			break;
		}
	}

	// object whose methods constructs different item pieces, used for lookup based on an array which determines the order, 
	var htmlStringConstructors = {
		itemIcon: function(logoName) {
			var htmlS = "<div class=\"tooltip_icon\" style=\"background-image:";
			htmlS += "url(img/items/" + logoName + ".png)\">";
			htmlS += "</div>";
			return htmlS;
		},

		skills: function(skillsData, cdr) {
			var htmlS = "<div class=\"tooltip_skills\">";

			skillsData.forEach(function(curr) {
				htmlS += "<div class=\"skill\">";
				htmlS += "<div class=\"skills_title clearfix\">" + "<h4 class=\"skills_title_text\">" + curr.title + "</h4>"; 
				if(cdr) {
					var manaCdr = ["cooldown_time", "mana_cost"];
					cdr.forEach(function(current, ind) {
						htmlS += "<div class=\"" + manaCdr[ind] + "\">" + current +"</div>";
					});
					cdr = false;
				}
				htmlS += "</div>";
				curr.text.forEach(function(line) {
					line = line.replace(/(\d+%*)/g, "<span class=\"skills_line_value\">$1</span>");
					var warn = "";
					if( line.substring(0, 8) === "**WARN**" ) {
						warn = "warning_message";
						line = line.substring(8);
					} 
					htmlS += "<p class=\"skills_line " + warn + "\">" + line + "</p>";
				});
				htmlS += "</div>";
			});

			htmlS += "</div>";
			return htmlS;
		},
		attributes: function(attrs) {
			var htmlS = "<ul class=\"tooltip_item_attrs\">";
			attrs.forEach(function(attribute) {
				htmlS += "<li class=\"attribute\">";
				htmlS += "<span class=\"attribute_value\">" + attribute[0] + " </span>";
				htmlS += "<span class=\"attribute_name\">" + attribute[1] + "</span>";
				htmlS += "</li>";
			});
			htmlS += "</ul>";
			return htmlS;
		},
		info: function(infoMsg) {
			var htmlS = "<div class=\"tooltip_info_messages\">";
			infoMsg.forEach(function(message) {
				htmlS += "<p class=\"tooltip_info_message\">" + message + "</p>";
			});
			htmlS += "</div>";
			return htmlS;
		},
		displayName: function(name) { return "<h3 class=\"tooltip_title\">" + name + "</h3>"; },
		lore: function(loreText) { return "<p class=\"tooltip_item_lore font_small\">" + loreText + "</p>"; },
		gold: function(goldValue) { return "<div class=\"tooltip_gold\">" + goldValue + "</div>"; }
	};
	
	// loops through the "order" properties, see which ones exist in the current item, and construct the HTML
	for(i = 0; i < order.length; i++) {
		// select the properties in the order of the "order" array, but only if they exist
		if(itemElement.hasOwnProperty(order[i])) {
			// exception for cooldown time and mana cost items (they are always displayed in the first skills item's title)
			if(order[i] === "skills" && itemElement.hasOwnProperty("cdCost")) {
			// calls the "skills" functions with an extra argument
				finalHTML += htmlStringConstructors[ order[i] ]( itemElement[ order[i] ],  itemElement.cdCost);
			}
			else {
				finalHTML += htmlStringConstructors[ order[i] ]( itemElement[ order[i] ]);
			}
		}
	}
	return finalHTML;
}

function tooltipDisplay(itemElement, displayContainer, itemList) {
	var leftDistance, rightDistance, windowScroll, itemPageHeight, bodyHeight, difference;
	// construct the tooltip
	displayContainer.innerHTML = itemInfoDisplay(itemElement.getAttribute("data-name"), itemList);
	// gets the body height and total window height
	windowScroll = window.scrollY + window.innerHeight;
	bodyHeight = document.body.offsetHeight;

	// Shows the tooltip (to be able to determine it's dimensions)
	displayContainer.classList.remove("hide");

	// --X AXIS -- Makes sure the tooltip is displayed on the side of the item which would give it most visibility
	// Calculates which sides would display most of the element
	leftDistance = itemElement.offsetLeft - displayContainer.offsetWidth;
	rightDistance = document.body.offsetWidth - (itemElement.offsetWidth + itemElement.offsetLeft + displayContainer.offsetWidth);
	if(leftDistance < rightDistance) {
		displayContainer.style.left = itemElement.offsetLeft + itemElement.offsetWidth + 2 + "px";
	}
	else {
		displayContainer.style.left = itemElement.offsetLeft - displayContainer.offsetWidth - 2 + "px";
	}

	// --Y AXIS--, Makes sure the tooltip doesn't go over the height of the body or of the window itself 
	displayContainer.style.top = itemElement.offsetTop + "px";
	itemPageHeight = displayContainer.offsetTop + displayContainer.offsetHeight;
	if (itemPageHeight > windowScroll) {
		difference = windowScroll - itemPageHeight - 15;
		displayContainer.style.top = parseInt(displayContainer.style.getPropertyValue("top")) + difference + "px";
	}
	else if (itemPageHeight > bodyHeight) {
		difference = bodyHeight - itemPageHeight - 15;
		displayContainer.style.top = parseInt(displayContainer.style.getPropertyValue("top")) + difference + "px";
	}
}

// main search function
// text searches the result items (based on the item name), "this" refers to the input element
function itemSearch(className, inputElement) {
	var 	currentElements = document.getElementsByClassName(className),
			matchedItems = [], // holds the items who were matched by the search query
			valueArr,
			i,
			j;
	currentElements.forEach = Array.prototype.forEach;

	if(inputElement.value.length >= 1) {
		// adds the class to the parent element (for styling purposes)
		currentElements[0].parentElement.classList.add("active_search");

		// splits the input into words
		valueArr = inputElement.value.split(/\u0020+/gi);

		// only keep the items who were matched by each of the input words
		// by looping though current items and each word of the input's value
		for(i = 0; i < filterData.currentItems.length; i++) {
			for(j = 0; j < valueArr.length; j++) {
				if(filterData.currentItems[i].displayInfo.displayName.indexOf( valueArr[j].toLowerCase() ) === -1) {
					// on a single failure to detect a word in that element, stops the filtering for this item
					break;
				}
				else if(j === valueArr.length - 1) {
					// only adds the element if the array reached its end without any failures
					matchedItems.push(filterData.currentItems[i]);
				}
			}
		}

		// removes the "match" class from all item elements
		currentElements.forEach(function(element) {
			element.classList.remove("match");
		});
		// adds it only to the matched elements
		currentElements.forEach(function(element) {
			matchedItems.forEach(function(matchedItem) {
				if(element.getAttribute("data-name") === matchedItem.itemName){
					element.classList.add("match");
				}
			});
		});
	}
	else {
		// for empty search input clear out the search results related classes
		currentElements[0].parentElement.classList.remove("active_search");
		currentElements.forEach(function(element) {
			element.classList.remove("match");
		});
	}
}

function tooltipHide(current) {
	var itemTooltip = document.getElementById("item_tooltip");
	itemTooltip.classList.remove("tooltip_whole_page");
	itemTooltip.classList.add("hide");
	tooltipHideBtn.classList.add("hide");
	wholePage = false;
	hideBody.classList.add("hide");
	documentRoot.classList.remove("whole_page_tooltip");
}

function tooltipShow(){
	windowLocation = window.scrollY;
	var itemTooltip = document.getElementById("item_tooltip");
	itemTooltip.style.left = "";
	itemTooltip.style.top = "";
	itemTooltip.classList.remove("hide");
	wholePage = true;
	itemTooltip.classList.add("tooltip_whole_page");
	tooltipHideBtn.classList.remove("hide");
	hideBody.classList.remove("hide");
	documentRoot.classList.add("whole_page_tooltip");
}


// ===============Page initialization===============
function init() {
	// get required DOM elements
	attrNames.forEach(function(currentProp) { // get the filter checkboxes elements
		inputElements[currentProp] = document.querySelector("input[value='" + currentProp + "']");
	});
	searchInput = document.getElementById("search_input"),
	searchResetBtn = document.getElementById("search_reset_btn"),
	itemsOutput = document.querySelector(".items_output"),
	checkboxes = document.querySelectorAll(".filters input[type='checkbox']"),
	resetBtn = document.querySelector(".filters_reset_btn"),
	tooltipHideBtn = document.getElementById("tooltip_hide"),
	mainWrapper = document.querySelector("main"),
	documentRoot = document.querySelector("html"),
	hideBody = document.getElementById("hide_body");
	// Checkboxes event listeners
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener("change", function() {
			// adds and remove the filters from the criterias array
			if (this.checked) {
				criterias.push(this.getAttribute("value"));
			}
			else { // removes that property upon unchecking
			  for(var i = 0; i < criterias.length; i++) {
				  if( criterias[i] === this.getAttribute("value") ) {
					  criterias.splice(i, 1);
				  }
			  }
			}
			// filters and displays based on criterias array
			filterElements();
			checkOtherFilters(filterData.currentItems);
			displayItems(itemsOutput, filterData.currentItems);
			addEvents();
		});
	}
	// Whole page tooltip hide button bar
	tooltipHideBtn.addEventListener("click", function() {
		if(window.getComputedStyle(documentRoot).position === "fixed"){
			var toScroll = true;
		}
		tooltipHide();
		if(toScroll){
			window.scrollTo(0, windowLocation);
		}
	});
	hideBody.addEventListener("click", function() {
		tooltipHide();
	});
	// Filters reset button
	resetBtn.addEventListener("click", function() {
		var searchInput = document.getElementById("search_input");
		attrNames.forEach(function(current) {
			inputElements[current].checked = false;
		});
		criterias = [];
		filterElements();
		checkOtherFilters();
		displayItems(itemsOutput, filterData.currentItems);
		addEvents();
		searchInput.value = "";
		itemSearch("item", searchInput);
	});
	// Search input event
	searchInput.addEventListener("input", function(evt) {
		if(this.value.length >= 1) { // prevents an error, empty string don't have the .search method
			// doesn't accept non (a-z A-Z and " " space) characters
			if(this.value[this.value.length - 1].search( /[^a-zA-Z\u0020']+/gi ) > -1 ) {
				this.value = this.value.substring(0, this.value.length - 1);
			}
		}
		itemSearch("item", this);
	});
	// make the input be accessible without actually having the focus, by using the a-z keyboard keys
	document.addEventListener("keydown", function(event) {
		// a-z and A-Z characters
		if( (event.which >= 65 && event.which <= 90) || (event.which >= 97 && event.which <= 122) ) {
			searchInput.focus();
		}
		// 27 --> ESC key, acts as input reset
		if (event.which === 27) {
			searchInput.value = "";
			itemSearch("item", searchInput);
		}
	});
	// Resets the search when using the reset button
	searchResetBtn.addEventListener("click", function(){
		searchInput.value = "";
		itemSearch("item", searchInput);
	});
	filterElements();
	displayItems(itemsOutput, filterData.currentItems);
	addEvents();	
}
init();
