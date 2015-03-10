function Carousel(view)
{
	window.addEventListener("keydown", this.keydownHandler.bind(this));

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
	this.visibleCanvas = view.getCarousel();
	this.visibleContext = this.visibleCanvas.getContext("2d");

	this.bufferCanvas = document.createElement('canvas')
	this.buffer = this.bufferCanvas.getContext("2d");
	this.bufferCanvas.width = this.visibleCanvas.width;
	this.bufferCanvas.height = this.visibleCanvas.height;

	this.visibleContext.textBaseline = this.buffer.textBaseline = "top";
	this.visibleContext.imageSmoothingEnabled = this.buffer.imageSmoothingEnabled = true;
	this.visibleContext.font = this.buffer.font = "25px sky-regular";
	this.visibleContext.fillStyle = this.buffer.fillStyle = SELECTED_WHITE;

	this.addNavItem(this.selectedIndex, 0, this.navData);
	this.selectNavItem(this.selectedIndex);
	this.visibleContext.drawImage(this.bufferCanvas,0,0);
}
Carousel.prototype.keydownHandler = function(event)
{
	switch (event.keyCode) 
	{
		case 37:
	     		//left
	            this.navigateLeft();
	            break;
	    case 38:
	            //up
	            break;
	    case 39:
	            this.navigateRight();
	            //right
	            break;
	    case 40:
	            //down
	            break;
	}
}
Carousel.prototype.addNavItem = function(index, xText, data) 
{
	if(index == data.length) return;

	var title = data[index].title;
	var textWidth = (0.5 + this.buffer.measureText(title).width) | 0;
	this.buffer.fillText(title, xText, 0);
	data[index].x = xText;
	data[index].width = textWidth + this.gap;
	this.addNavItem( ++index, xText + textWidth + this.gap, data);
}
Carousel.prototype.navigateRight = function()
{
	if(this.selectedIndex == (this.navData.length - 1)) return;

	this.deselectNavItem(this.selectedIndex);
	this.selectedIndex++
	this.selectNavItem(this.selectedIndex);
	var nextX = this.navData[this.selectedIndex].x
	var redraw = this.redraw.bind(this);
	TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw});
}
Carousel.prototype.navigateLeft = function()
{
	if(this.selectedIndex == 0) return;

	this.deselectNavItem(this.selectedIndex);
	this.selectedIndex--;
	this.selectNavItem(this.selectedIndex);
	var nextX = this.navData[this.selectedIndex].x;
	var redraw = this.redraw.bind(this);
	TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw});
}
Carousel.prototype.selectNavItem = function(index)
{
	var info = this.navData[index];
	this.buffer.save();
	this.buffer.clearRect(info.x, 0, info.width, this.visibleCanvas.height);
	this.buffer.fillStyle = FOCUSED_YELLOW;
	this.buffer.fillText(info.title, info.x, 0, info.width);
	this.buffer.restore();
}
Carousel.prototype.deselectNavItem = function(index)
{
	var info = this.navData[index];
	this.buffer.save();
	this.buffer.clearRect(info.x, 0, info.width, this.visibleCanvas.height);
	this.buffer.fillStyle = SELECTED_WHITE;
	this.buffer.fillText(info.title, info.x, 0, info.width);
	this.buffer.restore();
}
Carousel.prototype.redraw = function()
{
  //visibleContext.save();
  this.visibleContext.clearRect(0,0,this.visibleCanvas.width,this.visibleCanvas.height); // clear canvas
  this.visibleContext.drawImage(this.bufferCanvas,this.offsetX,0);
  //visibleContext.restore();
}