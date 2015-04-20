function Carousel(view)
{

	this.images = [];
	this.itemData = [];
	this.itemWidth = 193;
	this.itemHeight = 275;
	this.NUMBER_OF_ITEMS = 9;
	this.SPACING = 16;
	this.VANISHING_POINT_LEFT = 2;
	this.numberOfItems = 0;
	this.selectedIndex = 0;
	this.itemOffsetIndex = 0;
	this.currentX = 0;
	this.offsetX = 0;

	this.visibleCanvas = view.getCarousel();
	this.visibleContext = this.visibleCanvas.getContext("2d");

	this.selectionCanvas = view.getSelection();
	this.selectionContext = this.selectionCanvas.getContext("2d");

	this.bufferCanvas = document.createElement('canvas')
	this.buffer = this.bufferCanvas.getContext("2d");
	this.bufferCanvas.width = this.visibleCanvas.width;
	this.bufferCanvas.height = this.visibleCanvas.height;

	this.selection = new Image();

	//this.addNavItem(this.selectedIndex, 0, this.navData);
	//this.selectNavItem(this.selectedIndex);
	//this.visibleContext.drawImage(this.bufferCanvas,0,0);
}

Carousel.prototype.build = function(carouselVO)
{
	this.itemData = carouselVO.content.assets;

	var currentX = 0;
	var numItems = (this.NUMBER_OF_ITEMS<this.itemData.length) ? this.NUMBER_OF_ITEMS : this.itemData.length;

	this.itemOffsetIndex = this.selectedIndex - this.VANISHING_POINT_LEFT;
	this.itemOffsetIndex = (this.itemOffsetIndex<(this.itemData.length-this.NUMBER_OF_ITEMS)) ? this.itemOffsetIndex : (this.itemData.length-this.NUMBER_OF_ITEMS);
	this.itemOffsetIndex = (this.itemOffsetIndex>0) ? this.itemOffsetIndex : 0;

	Rx.Observable.range(this.itemOffsetIndex, this.itemOffsetIndex + numItems)
	.map(this.makeLoader.bind(this))
	.mergeAll()
	//.map(this.addImage.bind(this))
	.subscribe(this.addImage.bind(this));

	this.selection.src = "asset/img/all/highlight_item.png";

}
Carousel.prototype.makeLoader = function(val, i, observ)
{
	var url = this.formURLWithImage(this.itemData[i].links[0].href);
	var image = new Image();
	image.src = url;
	this.images[i] = image;
	var scope = this;
	//return Rx.Observable.fromEvent(image, "load");
	return Rx.Observable.fromEvent(image, "load", function(args) {
		return {image:args[0].target, index:i};
	} );
}
Carousel.prototype.addImage = function(payload) 
{
	console.log("added "+payload.index+" image.index="+this.getX(payload.index));//event.target.index
	this.buffer.drawImage(payload.image, this.getX(payload.index), 0);//this.getX(ind)
	this.visibleContext.drawImage(payload.image, this.getX(payload.index), 0);
	//return payload.image;
}
Carousel.prototype.formURLWithImage = function(url)
{
	var arr = url.split("?");
	var base = arr[0];
	url = base+"?s="+this.itemWidth+"x"+this.itemHeight;
	return url;
}
Carousel.prototype.getX = function(i)
{
	return (this.itemWidth + this.SPACING) * i;
}
Carousel.prototype.select = function()
{
	this.selectItem(this.selectedIndex)
}
Carousel.prototype.deselect = function()
{
	this.deselectItem(this.selectedIndex);
}
Carousel.prototype.selectItem = function(index)
{
	this.selectionContext.drawImage(this.selection,0,0);
}
Carousel.prototype.deselectItem = function(index)
{
	this.selectionContext.clearRect(0,0,this.itemWidth,this.itemHeight);
}
Carousel.prototype.navigateRight = function()
{
	if(this.selectedIndex == (this.itemData.length - 1)) return;

	this.deselectItem(this.selectedIndex);
	this.selectedIndex++
	//this.selectItem(this.selectedIndex);
	var packshotIndex = this.selectedIndex % this.NUMBER_OF_ITEMS;
	console.log("navigateRight -> selectedIndex="+this.selectedIndex+ " packshotIndex="+packshotIndex+" offsetIndex="+this.itemOffsetIndex);
	var nextX = packshotIndex * (this.itemWidth + this.SPACING)
	var redraw = this.redraw.bind(this);
	var selectItem = this.selectItem.bind(this);
	var nextIndexToLoad = this.selectedIndex + this.NUMBER_OF_ITEMS - 1;
	this.recycleNext(nextIndexToLoad)
	.map(this.redrawBuffer.bind(this))
	.subscribe();
	TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw, onComplete:selectItem, onCompleteParams:[this.selectedIndex]});
}
Carousel.prototype.navigateLeft = function()
{
	if(this.selectedIndex == 0) return;

	this.deselectItem(this.selectedIndex);
	this.selectedIndex--;
	//this.selectItem(this.selectedIndex);
	var packshotIndex = this.selectedIndex % this.NUMBER_OF_ITEMS;
	var nextX = packshotIndex * (this.itemWidth + this.SPACING)
	var redraw = this.redraw.bind(this);
	var selectItem = this.selectItem.bind(this);
	TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw, onComplete:selectItem, onCompleteParams:[this.selectedIndex]});
}
Carousel.prototype.recycleNext = function(nextIndex) 
{
	var loaderToRecycle = this.images.shift();
	this.images.push(loaderToRecycle);
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	return Rx.Observable.fromEvent(loaderToRecycle, "load");
}
Carousel.prototype.redrawBuffer = function(nextIndex) 
{
	var image;
	for(var i=0; i<this.images.length; i++)
	{
		image = this.images[i];
		this.buffer.drawImage(image,this.getX(i),0);
	}
}
Carousel.prototype.redraw = function()
{
  //visibleContext.save();
  this.visibleContext.clearRect(0,0,this.visibleCanvas.width,this.visibleCanvas.height); // clear canvas
  this.visibleContext.drawImage(this.bufferCanvas,this.offsetX,0);
  //visibleContext.restore();
}

