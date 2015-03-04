// app.controller("navigation", function($scope) {
//     $scope.keydown = function(e) {
// 	    switch (e.keyCode) {
// 	        case 37:
// 	            //left
// 	            navigateLeft();
// 	            break;
// 	        case 38:
// 	            //up
// 	            break;
// 	        case 39:
// 	        	navigateRight();
// 	            //right
// 	            break;
// 	        case 40:
// 	            //down
// 	            break;
// 	    }
// 	};
// 	var selectedIndex = 0;
// 	var gap = 40;
// 	var navData = [
// 		{
// 			title:"My Library",
// 			x:0,
// 			width:0
// 		},
// 		{
// 			title:"My Account",
// 			x:0,
// 			width:0
// 		},
// 		{
// 			title:"Help",
// 			x:0,
// 			width:0
// 		},
// 		{
// 			title:"About sky Store",
// 			x:0,
// 			width:0
// 		} 
// 	];

// 	var offsetX = 0;
// 	var visibleCanvas = $scope;//document.getElementById("nav_canvas");
// 	var visibleContext = visibleCanvas.getContext("2d");


// 	var bufferCanvas = document.createElement('canvas')
// 	var buffer = bufferCanvas.getContext("2d");
// 	bufferCanvas.width = visibleCanvas.width;
// 	bufferCanvas.height = visibleCanvas.height;

// 	visibleContext.textBaseline = buffer.textBaseline = "top";
// 	visibleContext.imageSmoothingEnabled = buffer.imageSmoothingEnabled = true;
// 	visibleContext.font = buffer.font = "25px sky-regular";
// 	visibleContext.fillStyle = buffer.fillStyle = SELECTED_WHITE;

// 	function addNavItem(index, xText, data) 
// 	{
// 		if(index == data.length) return;

// 		var title = data[index].title;
// 		var textWidth = (0.5 + buffer.measureText(title).width) | 0;
// 		buffer.fillText(title, xText, 0);
// 		data[index].x = xText;
// 		data[index].width = textWidth + gap;
// 		addNavItem( ++index, xText + textWidth + gap, data);
// 	}

// 	function navigateRight()
// 	{
// 		if(selectedIndex == (navData.length - 1)) return;

// 		deselectNavItem(selectedIndex);
// 		selectedIndex++
// 		selectNavItem(selectedIndex);
// 		var nextX = navData[selectedIndex].x
// 		TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw});
// 	}

// 	function navigateLeft()
// 	{
// 		if(selectedIndex == 0) return;

// 		deselectNavItem(selectedIndex);
// 		selectedIndex--;
// 		selectNavItem(selectedIndex);
// 		var nextX = navData[selectedIndex].x
// 		TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw});
// 	}

// 	function selectNavItem(index)
// 	{
// 		var info = navData[index];
// 		buffer.save();
// 		buffer.clearRect(info.x, 0, info.width, visibleCanvas.height);
// 		buffer.fillStyle = FOCUSED_YELLOW;
// 		buffer.fillText(info.title, info.x, 0, info.width);
// 		buffer.restore();
// 	}

// 	function deselectNavItem(index)
// 	{
// 		var info = navData[index];
// 		buffer.save();
// 		buffer.clearRect(info.x, 0, info.width, visibleCanvas.height);
// 		buffer.fillStyle = SELECTED_WHITE;
// 		buffer.fillText(info.title, info.x, 0, info.width);
// 		buffer.restore();
// 	}

// 	function redraw()
// 	{
// 		//visibleContext.save();
// 		visibleContext.clearRect(0,0,visibleCanvas.width,visibleCanvas.height); // clear canvas
// 		visibleContext.drawImage(bufferCanvas,offsetX,0);
// 		//visibleContext.restore();
// 	}



// 	addNavItem(selectedIndex,0, navData);
// 	selectNavItem(selectedIndex);
// 	visibleContext.drawImage(bufferCanvas,0,0);

// });