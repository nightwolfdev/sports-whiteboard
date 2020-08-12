// Board class.
function Board() {
	this.backgroundColor = '#f5f7fa';
	this.activeClass = 'active';
	this.swatchOpen = false;
	this.color = '#434a54';
	this.penSize = 5;
	this.easing = 1;	
	this.eraserSize = 15;
	this.toggleActions = ['addPlayer','addBall','drawing','erasing'];
	this.moving = true;
	this.addPlayer = false;
	this.addBall = false;
	this.drawing = false;
	this.erasing = false;
	this.x = 0;
	this.y = 0;
	this.px = 0;
	this.py = 0;
	this.easing = 0.3;
	this.padding = 20;
	this.objects = {
		player: 'fa-user fa-3x player',
		ball: 'fa-circle fa-2x ball'
	}
}

// Setup board.
Board.prototype.setup = function() {
	background(this.backgroundColor);
	this.buildControls();
	this.buildSwatches();
}

// Set defaults.
Board.prototype.setDefaults = function(resetColor) {
	
	// Set default move action.
	this.moving = true;
	
	// Set default color.
	if (resetColor) {
		this.color = '#434a54';
	}
	
	// Deactivate/disable all other actions.
	for (var i=0; i<this.toggleActions.length; i++) {
		var action = this.toggleActions[i],
			button = select('#'+action);
		button.removeClass(this.activeClass);
		this[action] = false;
	}
	
}

// Reset board.
Board.prototype.reset = function() {
	this.setDefaults(true);
	this.removeControls();
	this.removeObjects();
	this.setup();
}

// Remove controls.
Board.prototype.removeControls = function() {
	var swatches = select('#swatches'),
		controlsBackground = select('#controlsBackground'),
		controls = selectAll('.control'),
		c;
	swatches.remove();
	controlsBackground.remove();
	for (c=0; c<controls.length; c++) {
		var control = controls[c];
		control.remove();
	}
}

// Remove objects.
Board.prototype.removeObjects = function() {
	var	objects = selectAll('.object'),
		o;
	for (o=0; o<objects.length; o++) {
		var object = objects[o];
		object.remove();
	}
}

// Build controls.
Board.prototype.buildControls = function() {

	// Define variables.
	var controls = [
			{id:'changeColor', title:'Change Color', class:'fa-tint', callback:changeColor},
			{id:'addPlayer', title:'Add Object (Toggle On/Off)', class:'fa-user', callback:toggleControl},
			{id:'addBall', title:'Add Object (Toggle On/Off)', class:'fa-circle', callback:toggleControl},
			{id:'drawing', title:'Draw', class:'fa-pencil', callback:toggleControl},
			{id:'erasing', title:'Erase', class:'fa-pencil fa-rotate-180', callback:toggleControl},
			{id:'trash', title:'Clear Board', class:'fa-trash-o', callback:clearBoard},
		],
		iconSize = 40,
		padding = 5,
		controlsBackgroundWidth = padding + ((iconSize + padding) * controls.length),
		controlsBackgroundHeight = 40,
		controlsBackgroundStartX = (windowWidth / 2) - (controlsBackgroundWidth / 2),
		controlsBackgroundStartY = windowHeight - controlsBackgroundHeight,
		controlsBackground = createDiv(''),
		x = padding,
		y = padding,
		i;
		
	// Create controls background.
	controlsBackground.id('controlsBackground');
	controlsBackground.size(controlsBackgroundWidth,controlsBackgroundHeight);
	controlsBackground.style('background-color','#ccc');
	controlsBackground.position(controlsBackgroundStartX,controlsBackgroundStartY);
	
	// Create controls.
	for (i=0; i<controls.length; i++) {
		
		// Define variables.
		var control = controls[i],
			button = createSpan('');
		
		// Define button characteristics.
		button.parent(controlsBackground);
		button.id(control.id);
		button.addClass('fa ' + control.class + ' fa-2x fa-fw control');
		button.attribute('title',control.title);
		button.position(x,y);
		if (control.callback) {
			button.mousePressed(control.callback);
		}
		
		// Increment x position.
		x += iconSize + padding;
		
	}

}

// Build swatches.
Board.prototype.buildSwatches = function() {

	// Define variables.
	var colors = [
			'#434a54',
			'#6c1714',
			'#79298c',	
			'#0f75bd',
			'#f25f7c',
			'#ef8122',
			'#818286',
			'#da4628',			
			'#7d6aaa',			
			'#8cc63e',
			'#a67f3b',
			'#f0b929'			
		],
		swatchSize = 32,
		padding = 5,
		controlsBackground = select('#controlsBackground'),
		controlsBackgroundHeight = controlsBackground.height + padding,
		controlsBackgroundPosition = controlsBackground.position(),		
		swatchesBackground = createDiv(''),
		swatchesBackgroundWidth = padding + ((swatchSize + padding) * (colors.length / 2)),
		swatchesBackgroundHeight = 79,
		swatchesBackgroundStartX = controlsBackgroundPosition.x,
		swatchesBackgroundStartY = controlsBackgroundPosition.y - controlsBackgroundHeight - swatchSize - (padding * 2),
		x = padding,
		y = padding,
		i;

	// Build swatches background.
	swatchesBackground.id('swatches');
	swatchesBackground.size(swatchesBackgroundWidth,swatchesBackgroundHeight);
	swatchesBackground.style('background-color','#ececec');
	swatchesBackground.style('border','1px solid #ccc');	
	swatchesBackground.style('z-index',9999);
	swatchesBackground.position(swatchesBackgroundStartX,swatchesBackgroundStartY);
	swatchesBackground.hide();
	
	// Build swatches.
	for (i=0; i<colors.length; i++) {
		
		// Define variables.
		var color = colors[i],
			swatch = createSpan('');
			
		// Define swatch characteristics.
		swatch.parent(swatchesBackground);
		swatch.size(swatchSize,swatchSize);
		swatch.attribute('data-color',color);
		swatch.style('background-color',color);
		swatch.style('border','1px solid #000');
		swatch.style('cursor','pointer');
		swatch.position(x,y);
		swatch.mousePressed(swatchSelected);
		
		// Increment swatch position.
		x += swatchSize + padding;
		
		if (i == 5) { 
			x = padding;
			y = padding + swatchSize + padding;
		}		
		
	}

}

// Move object on board.
Board.prototype.move = function() {
	
	// Define variables.
	var active = false,
		objects = selectAll('.object'),
		x = mouseX,
		y = mouseY,
		padding = this.padding,
		minWidth = padding,
		maxWidth = windowWidth - padding,
		minHeight = padding,
		maxHeight = windowHeight - padding,
		width,
		height,
		i;
		
	// Find active object.
	for (i=0; i<objects.length; i++) {
		var object = objects[i],
			classes = object.class(),
			position = object.position(),
			size = object.size();
		if (classes.indexOf(this.activeClass) >= 0) { 
			active = true;
			width = size.width;
			height = size.height;
			break;
		}
	}
	
	// If there's an active object, move it to mouse/touch position but don't allow it to go beyond padded edges.
	if (active) {
		
		// Adjust movement to center of object.
		x = x - (width / 2);
		y = y - (height / 2);		
		
		if (position.x < minWidth) {
			x = padding;
		}
		if (position.x + width > maxWidth) {
			x = windowWidth - (width + padding);
		}
		if (position.y < minHeight) {
			y = padding;	
		}
		if (position.y + height > maxHeight) { 
			y = windowHeight - (height + padding);
		}
		
		// Position the object.
		object.position(x,y);
		
	}	
	
}

// Draw on board based on mouse/touch location.
Board.prototype.draw = function() {
	var targetX = mouseX,
		targetY = mouseY;
	this.x += (targetX - this.x) * this.easing;
	this.y += (targetY - this.y) * this.easing;
	strokeWeight(this.penSize);
	stroke(this.color);
	line(this.x,this.y,this.px,this.py);
	this.px = this.x;
	this.py = this.y;
}

// Erase drawing on board based on mouse/touch location.
Board.prototype.erase = function() {
	strokeWeight(this.eraserSize);
	stroke(this.backgroundColor);
	line(mouseX,mouseY,pmouseX,pmouseY);	
}