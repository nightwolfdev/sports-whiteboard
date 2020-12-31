// Define variables.
var board;
	
// Register service worker for offline access.
if ('serviceWorker' in navigator) {
	window.addEventListener('load',function() {
		navigator.serviceWorker.register('serviceWorker.js');
	});
}	

// Setup.
function setup() {
	board = new Board();
	createCanvas(windowWidth,windowHeight);
	background(board.backgroundColor);	
	board.setup();
}

// Run when the window is resized.
function windowResized() {
	resizeCanvas(windowWidth,windowHeight);
	board.reset();
}

function draw() {
	
}

// Run when the canvas is clicked on/touched.
function mousePressed(e) {

	// Define variables.
	var parent = e.target.parentElement,
		parentID = parent ? parent.id : '';

	// Only add objects if the click/touch is not on the controls or swatches. 
	if (parentID.toUpperCase() != 'CONTROLSBACKGROUND' && parentID.toUpperCase() != 'SWATCHES') {
	
		// Add player control enabled.
		if (board.addPlayer) {
			addObject('player');	
		}
	
		// Add ball control enabled.
		if (board.addBall) {
			addObject('ball');
		}

		// Draw control enabled.
		if (board.drawing) {
			board.draw(false);
		}		
		
		// Set coordinates of mouse/touch.
		board.x = mouseX;
		board.y = mouseY;
		board.px = mouseX;
		board.py = mouseY;		
		
	}
	
	// Prevent default functionality.
	return false;	
	
}

// Run when the mouse/touch is dragged.
function mouseDragged(e) {
	
	// Define variables.
	var parent = e.target.parentElement,
		parentID = parent ? parent.id : '';	

	// Move control enabled.
	if (board.moving) {		
		board.move();
	}
	
	// Only draw/erase if the click/touch is not on the controls or swatches. 
	if (parentID.toUpperCase() != 'CONTROLSBACKGROUND' && parentID.toUpperCase() != 'SWATCHES') {
	
		// Draw control enabled.
		if (board.drawing) {
			board.draw(true);
		}
	
		// Erase control enabled.
		if (board.erasing) {
			board.erase();	
		}
		
	}

	// Prevent default functionality.
	return false;
	
}

// Run when the Change Color button is pressed.
function changeColor() {

	// Define variables.
	var classes = this.class(),
		swatches = select('#swatches');
	
	// Toggle active class.
	if (classes.indexOf('active') >= 0) {
		this.removeClass('active');	
	} else {
		this.addClass('active');
	}
	
	// Toggle swatches panel.
	if (board.swatchOpen) {
		swatches.hide();
	} else {
		swatches.show();
	}
	board.swatchOpen = !board.swatchOpen;	
	
	// Prevent default functionality.
	return false;	
	
}

// Run when a swatch is selected.
function swatchSelected() {

	// Define variables.
	var swatches = select('#swatches'),
		color = this.attribute('data-color'),
		button = select('#changeColor');
	
	// When the color picker value changes, update the button and board color with the selection.
	button.removeClass('active');
	button.style('color',color);
	board.color = color;
	
	// Close swatches.
	board.swatchOpen = false;
	swatches.hide();

	// Prevent default functionality.
	return false;
	
}

// Run when adding an object is enabled and screen is clicked/touched.
function addObject(object) {
	
	// Define variables.
	var padding = board.padding,
		minWidth = padding,
		maxWidth = windowWidth - padding,
		minHeight = padding,
		maxHeight = windowHeight - padding,
		obj,
		objSize,
		xCenter,
		yCenter;
	
	// Only create object if it's within padded border.
	if ((mouseX > minWidth) && (mouseX < maxWidth) && (mouseY > minHeight) && (mouseY < maxHeight)) {

		// Build object.
		obj = createSpan('');
		obj.addClass('fa object ' + board.objects[object]);
		objSize = obj.size();
		xCenter = objSize.width / 2;
		yCenter = objSize.height / 2;
		obj.style('color',board.color);
		obj.position(mouseX - xCenter,mouseY - yCenter);
		obj.mousePressed(activateObject);
		obj.mouseReleased(deactivate);
	
	}
	
	// Prevent default functionality.
	return false;
	
}

// Run when an object is pressed.
function activateObject() {

	// Define variables.
	var objects = selectAll('.object'),
		classes = this.class(),
		i;
	
	// Remove selection class from all objects.
	for (i=0; i<objects.length; i++) {
		var object = objects[i];
		object.removeClass(board.activeClass);
	}
	
	if (classes.indexOf(board.activeClass) == -1) {
		if (board.erasing) {
			// Remove object if remove control is enabled.
			this.remove();
		}
		// Add selection class to object.
		this.addClass(board.activeClass);
	}
	
	// Prevent default functionality.
	return false;

}

// Remove active class.
function deactivate() {
	this.removeClass(board.activeClass);
	return false;
}

// Run when a toggle button is pressed.
function toggleControl(e) {

	// Define variables.
	var id = e.target.id,
		i;

	if (board[id]) {
		
		// Deactivate current toggle button.
		this.removeClass(board.activeClass);
		
		// Set default actions.
		board.setDefaults(false);
		
	} else {
		
		// Disable moving.
		board.moving = false;
		
		// Activate current toggle button.
		this.addClass(board.activeClass);
		
		// Loop through all toggle actions.
		for (i=0; i<board.toggleActions.length; i++) {			
			var action = board.toggleActions[i],
				button = select('#'+action);
			if (action == id) {
				// Enable action for current toggle button.
				board[action] = true;	
			} else {
				// Deactivate/disable action for other toggle buttons.
				button.removeClass(board.activeClass);
				board[action] = false;
			}
		}		
		
	}
	
	// Prevent default functionality.
	return false;

}

// Run when the Clear Board button is pressed.
function clearBoard() {
	board.reset();
	return false;
}