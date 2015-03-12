function Carousel(view)
{
	window.addEventListener("keydown", this.keydownHandler.bind(this));

	this.items = [];
	this.itemData = [];
	this.NUMBER_OF_ITEMS = 9;
	this.SPACING = 16;
	this.VANISHING_POINT_LEFT = 2;
	this.numberOfItems = 0;
	this.selectedIndex = 0;
	this.itemOffsetIndex = 0;

	this.visibleCanvas = view.getCarousel();
	this.visibleContext = this.visibleCanvas.getContext("2d");

	this.bufferCanvas = document.createElement('canvas')
	this.buffer = this.bufferCanvas.getContext("2d");
	this.bufferCanvas.width = this.visibleCanvas.width;
	this.bufferCanvas.height = this.visibleCanvas.height;

	//this.addNavItem(this.selectedIndex, 0, this.navData);
	//this.selectNavItem(this.selectedIndex);
	//this.visibleContext.drawImage(this.bufferCanvas,0,0);
}
Carousel.prototype.keydownHandler = function(event)
{
	switch (event.keyCode) 
	{
		case 37:
	     		//left
	            //this.navigateLeft();
	            break;
	    case 38:
	            //up
	            break;
	    case 39:
	            //this.navigateRight();
	            //right
	            break;
	    case 40:
	            //down
	            break;
	}
}
Carousel.prototype.build = function(carouselVO)
{
	this.itemData = carouselVO.content.assets;

	var currentX = 0;
	var numItems = (this.NUMBER_OF_ITEMS<this.itemData.length) ? this.NUMBER_OF_ITEMS : this.itemData.length;

	this.itemOffsetIndex = this.selectedIndex - this.VANISHING_POINT_LEFT;
	//_itemOffsetIndex = Math.min(_itemOffsetIndex ,_itemData.length-NUMBER_OF_ITEMS);
	this.itemOffsetIndex = (this.itemOffsetIndex<(this.itemData.length-this.NUMBER_OF_ITEMS)) ? this.itemOffsetIndex : (this.itemData.length-this.NUMBER_OF_ITEMS);
	//_itemOffsetIndex = Math.max(_itemOffsetIndex ,0);
	this.itemOffsetIndex = (this.itemOffsetIndex>0) ? this.itemOffsetIndex : 0;

	for(var i = this.itemOffsetIndex; i < this.itemOffsetIndex + numItems; i++)
	{
		// renderer = new _itemRendererType();
		// var d:Object = _itemData[i];
		// renderer.render(d);
		// renderer.x = currentX;
		// currentX += renderer.width + SPACING;
		// _items[i% NUMBER_OF_ITEMS] = renderer;
		// _itemHolder.addChild(renderer);
		var item = new CarouselItem();
		currentX += item.width + this.SPACING;
		item.x = currentX;
		item.load(this.itemData[i].links[0].href);
		item.onImageLoaded.add(this.addItem.bind(this));

		this.items[i%this.NUMBER_OF_ITEMS] = item;
	}	
	
		//_itemHolder.x = -selectedItemRenderer.x;
		//selectedItemRenderer.onItemChanged.add(onCarouselStopped.dispatch);
		//_flushTimer.start();

}
Carousel.prototype.addItem = function(image, itemX) 
{
	this.buffer.drawImage(image,itemX,0);
	this.visibleContext.drawImage(this.bufferCanvas,0,0);
}