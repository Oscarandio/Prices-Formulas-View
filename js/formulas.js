// Data State
var data = {
	listItems: []
};
var lastEdited = -1;
// UI Template
var template = function () {
    // If there are no list items
    if (data.listItems.length < 1)
        return "<p><em>You do not have any formulas yet. Try adding one with the form above.</em></p>";
	
    var id = 0;
    return (
        "<ul>" +
        data.listItems
        .map(function (item) {
            if(lastEdited > -1 && lastEdited == id){
                templateEdit = "<li id='" + id + "'><input type='text' id='input"+id+"' value='"+item+"'>"
                buttonedit = "<button class='editb' onClick='savef("+id+")'>Save</button>"
				templateend = "</li>"
            } else {
                templateEdit = "<li id='" + id + "'><p>" + item  + "<button class='removeb' onClick='removef("+id+")'>Remove</button>"
                buttonedit = "<button class='editb' onClick='editf("+id+")'>Edit</button>"
				templateend = '<button class="resultb" onClick="resultf(' + id + ')">' + "Apply</button></li> </p>"

            }
            id++;
            return (templateEdit + buttonedit + templateend);
        })
        .join("") +
        "</ul>"
    );
};

// Remove formula and cancel price result
var removef = function (id) {
	const rbs = document.querySelectorAll('input[name="price"]');
            let selectedValue;
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue = rb.value;
                    break;
                }
            }
	item = data.listItems[id];
	if (item.indexOf('%') >= 0) {
		item = item.replace('%', '*0.01')
	}
	data.listItems.splice(id, 1);
	price = document.getElementsByClassName("price")[selectedValue].innerHTML
	document.getElementsByClassName("result")[selectedValue].innerHTML = price;
	console.log(price);
	
	render();
	
};

var editf = function (id) {
    lastEdited = id;
    render()
}

var savef = function (id) {
    lastEdited = -1;
    inputvalue = document.getElementById("input"+id).value
    data.listItems[id] = inputvalue
    render()
}
// Result
var resultf = function (id) {
	const rbs = document.querySelectorAll('input[name="price"]');
            let selectedValue;
            for (const rb of rbs) {
                if (rb.checked) {
                    selectedValue = rb.value;
                    break;
                }
            }
	item = data.listItems[id];
	if (item.indexOf('%') >= 0) {
		item = item.replace('%', '*0.01')
	}
	price = document.getElementsByClassName("price")[selectedValue].innerHTML;
	price2 = price.slice(0, -1);
	result = eval(price2 + item);
	result = result.toFixed(1).replace(/.?0+$/, '');
	euro = "€";
	result = result.concat(euro);
	document.getElementsByClassName("result")[selectedValue].innerHTML = result;
  };

// Function to render the UI into the DOM
var render = function () {
	// Render the UI
	var list = document.querySelector("#list");
	if (!list) return;
	list.innerHTML = template();

	// Save to localStorage
	localStorage.setItem("list", JSON.stringify(data));
};

// Check for saved list items
var savedData = localStorage.getItem("list");
if (savedData) {
	data = JSON.parse(savedData);
}

// Render the UI
render();

// Sanitize and encode all HTML in a user-submitted string

var sanitizeHTML = function (str) {
	var temp = document.createElement("div");
	temp.textContent = str;
	return temp.innerHTML;
};

// Listen for form submissions
document.addEventListener(
	"submit",
	function (event) {
		// Make sure the submitted form was for our list items
		if (!event.target.matches("#add-to-list")) return;

		// Stop the form from submitting
		event.preventDefault();

		// Get the list item
		var item = event.target.querySelector("#list-item");
		if (!item || item.length < 1) return;

		// Update the data and UI
		data.listItems.push(sanitizeHTML(item.value));
		render();

		// Clear the field and return to focus
		item.value = "";
		item.focus();
	},
	false
);