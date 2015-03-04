
var navProto = Object.create(HTMLCanvasElement.prototype);

navProto.createdCallback = function() 
{
	this.addEventListener("keydown", function(e) 
		{
			switch (e.keyCode) 
			{
				case 37:
					//left
					navigateLeft();
					break;
				case 38:
					//up
					break;
				 case 39:
					navigateRight();
					//right
					break;
				 case 40:
					//down
					 break;
			}
		}
	);

	this.selectedIndex = 0;
	this.gap = 40;
	this.navData = [
		{
			title:"My Library",
			x:0,
			width:0
		},
		{
			title:"My Account",
			x:0,
			width:0
		},
		{
			title:"Help",
			x:0,
			width:0
		},
		{
			title:"About sky Store",
			x:0,
			width:0
		} 
	];

	this.offsetX = 0;
	this.visibleCanvas = this;
	this.visibleContext = visibleCanvas.getContext("2d");

	this.bufferCanvas = document.createElement('canvas')
	this.buffer = bufferCanvas.getContext("2d");
	this.bufferCanvas.width = this.visibleCanvas.width;
	this.bufferCanvas.height = this.visibleCanvas.height;

	this.visibleContext.textBaseline = this.buffer.textBaseline = "top";
	this.visibleContext.imageSmoothingEnabled = this.buffer.imageSmoothingEnabled = true;
	this.visibleContext.font = this.buffer.font = "25px sky-regular";
	this.visibleContext.fillStyle = this.buffer.fillStyle = SELECTED_WHITE;

	addNavItem(selectedIndex,0, navData);
	selectNavItem(selectedIndex);
	visibleContext.drawImage(bufferCanvas,0,0);
};

navProto.addNavItem = function(index, xText, data) 
	{
		if(index == data.length) return;

		var title = data[index].title;
		var textWidth = (0.5 + buffer.measureText(title).width) | 0;
		buffer.fillText(title, xText, 0);
		data[index].x = xText;
		data[index].width = textWidth + gap;
		addNavItem( ++index, xText + textWidth + gap, data);
	}

	navProto.navigateRight = function()
	{
		if(selectedIndex == (navData.length - 1)) return;

		deselectNavItem(selectedIndex);
		selectedIndex++
		selectNavItem(selectedIndex);
		var nextX = navData[selectedIndex].x
		TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw});
	}

	navProto.navigateLeft = function()
	{
		if(selectedIndex == 0) return;

		deselectNavItem(selectedIndex);
		selectedIndex--;
		selectNavItem(selectedIndex);
		var nextX = navData[selectedIndex].x
		TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw});
	}

	navProto.selectNavItem = function(index)
	{
		var info = navData[index];
		buffer.save();
		buffer.clearRect(info.x, 0, info.width, visibleCanvas.height);
		buffer.fillStyle = FOCUSED_YELLOW;
		buffer.fillText(info.title, info.x, 0, info.width);
		buffer.restore();
	}

	navProto.deselectNavItem = function(index)
	{
		var info = navData[index];
		buffer.save();
		buffer.clearRect(info.x, 0, info.width, visibleCanvas.height);
		buffer.fillStyle = SELECTED_WHITE;
		buffer.fillText(info.title, info.x, 0, info.width);
		buffer.restore();
	}

	navProto.redraw = function()
	{
		//visibleContext.save();
		visibleContext.clearRect(0,0,visibleCanvas.width,visibleCanvas.height); // clear canvas
		visibleContext.drawImage(bufferCanvas,offsetX,0);
		//visibleContext.restore();
	}

var Navigation = document.registerElement('c-navigation', {
	prototype: navProto,
	extends: 'canvas'
});

// var n = document.createElement('c-navigation');
// document.body.appendChild(n);

// angular.module('navigation', [])
//   .directive('cNavigation', function() {
//     return {
//       scope: {},
//       templateUrl: 'navigation.html',
//       replace: true,
//       controller: 'NavigationCtrl',
//       controllerAs: 'ctrl'
//     };
//   })
//   .controller('NavigationCtrl', function($scope) {

  
//   });

var app = angular.module("app", []);//'navigation'
