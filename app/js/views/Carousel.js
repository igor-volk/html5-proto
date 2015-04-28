function Carousel(view)
{

	this.images = [];
	this.itemData = [];
	this.itemWidth = 193;
	this.itemHeight = 275;
	this.NUMBER_OF_ITEMS = 8;
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
	this.bufferCanvas.width = 1672;//this.visibleCanvas.width;
	this.bufferCanvas.height = this.visibleCanvas.height;

	this.selection = new Image();
	this.placeholder = new Image();
	this.imageCounter = 0;
}

Carousel.prototype.build = function(carouselVO)
{
	this.itemData = carouselVO.content.assets;

	var currentX = 0;
	var numItems = (this.NUMBER_OF_ITEMS<this.itemData.length) ? this.NUMBER_OF_ITEMS : this.itemData.length;

	this.itemOffsetIndex = this.selectedIndex - this.VANISHING_POINT_LEFT;
	this.itemOffsetIndex = (this.itemOffsetIndex<(this.itemData.length-this.NUMBER_OF_ITEMS)) ? this.itemOffsetIndex : (this.itemData.length-this.NUMBER_OF_ITEMS);
	this.itemOffsetIndex = (this.itemOffsetIndex>0) ? this.itemOffsetIndex : 0;

	this.subscr = Rx.Observable.range(this.itemOffsetIndex, this.itemOffsetIndex + numItems)
	.map(this.makeLoader.bind(this))
	.mergeAll()
	//.map(this.addImage.bind(this))
	.subscribe(this.addImage.bind(this));

	this.selection.src = "asset/img/all/highlight_item.png";
	this.placeholder.src = "asset/img/all/default_placeholder_193x275.png";
}
Carousel.prototype.makeLoader = function(val, i, observ)
{
	var a = arguments;
	var url = this.formURLWithImage(this.itemData[i].links[0].href);
	var image = new Image();
	image.src = url;
	this.images[i] = image;
	return Rx.Observable.fromEvent(image, "load", function(args) {
		return {image:args[0].target, index:i, count:observ.source.count};
	} );
}
Carousel.prototype.addImage = function(payload) 
{
	var a = arguments;
	this.imageCounter++;
	//console.log("added "+payload.index+" x="+this.getX(payload.index) + " count="+payload.count);
	this.buffer.drawImage(payload.image, this.getX(payload.index), 0);
	this.visibleContext.drawImage(payload.image, this.getX(payload.index), 0);
	if(this.imageCounter > (payload.count - 1))
	{
		this.subscr.dispose();
		this.imageCounter = 0;
	}
}
Carousel.prototype.navigateRight = function()
{
	if(this.selectedIndex == (this.itemData.length - 1)) return;

	this.deselect();
	this.selectedIndex++
	//var packshotIndex = this.selectedIndex % this.NUMBER_OF_ITEMS;
	//console.log("navigateRight -> selectedIndex="+this.selectedIndex+ " packshotIndex="+packshotIndex+" offsetIndex="+this.itemOffsetIndex);
	var nextX = this.itemWidth + this.SPACING;//packshotIndex * (this.itemWidth + this.SPACING)
	var redraw = this.redraw.bind(this);
	var selectItem = this.selectItem.bind(this);
	var nextIndexToLoad = this.selectedIndex + this.NUMBER_OF_ITEMS - 1;

	this.recycleNextRight(nextIndexToLoad).subscribe(this.addToBufferRight.bind(this));

	var onTweenComplete = this.onTweenComplete.bind(this);
	this.tween = TweenLite.to(this, 0.8, {offsetX:-(nextX), onUpdate:redraw, onComplete:onTweenComplete, onCompleteParams:[this.selectedIndex]});
}
Carousel.prototype.recycleNextRight = function(nextIndex) 
{
	var loaderToRecycle = this.images.shift();
	this.images.push(loaderToRecycle);
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	return Rx.Observable.fromEvent(loaderToRecycle, "load");
}
Carousel.prototype.addToBufferRight = function() 
{
	var lastIndex = this.images.length - 1;
	var image = this.images[lastIndex];
	var newX = this.getX(lastIndex);
	if(image.width > 0) this.buffer.drawImage(image,newX,0);
	else this.buffer.drawImage(this.placeholder,newX,0);
}
Carousel.prototype.navigateLeft = function()
{
	if(this.selectedIndex == 0) return;

	this.deselect();
	this.selectedIndex--;
	//var packshotIndex = this.selectedIndex % this.NUMBER_OF_ITEMS;
	//console.log("navigateLeft -> selectedIndex="+this.selectedIndex+ " packshotIndex="+packshotIndex+" offsetIndex="+this.itemOffsetIndex);
	var nextX = this.itemWidth + this.SPACING;//packshotIndex * (this.itemWidth + this.SPACING);
	var redraw = this.redraw.bind(this);
	var selectItem = this.selectItem.bind(this);
	var nextIndexToLoad = this.selectedIndex;

	this.recycleNextLeft(nextIndexToLoad).subscribe(this.addToBufferLeft.bind(this));

	var onTweenComplete = this.onTweenComplete.bind(this);
	this.tween = TweenLite.to(this, 0.8, {offsetX:(nextX), onUpdate:redraw, onComplete:onTweenComplete, onCompleteParams:[this.selectedIndex]});//selectitem
}
Carousel.prototype.addToBufferLeft = function() 
{
	var image = this.images[0];
	var newX = 0;
	if(image.width > 0) this.buffer.drawImage(image,newX,0);
	else this.buffer.drawImage(this.placeholder,newX,0);
}
Carousel.prototype.recycleNextLeft = function(nextIndex) 
{
	var loaderToRecycle = this.images.pop();
	this.images.unshift(loaderToRecycle);
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	return Rx.Observable.fromEvent(loaderToRecycle, "load");
}
Carousel.prototype.redrawBuffer = function() 
{
	var image;
	//this.offsetX = 0;
	for(var i=0; i<this.images.length; i++)
	{
		image = this.images[i];
		var newX = this.getX(i);
		if(image.width > 0) this.buffer.drawImage(image,newX,0);
		else this.buffer.drawImage(this.placeholder,newX,0);
	}
	//this.redraw();
	//this.tween.kill();
	this.select();
}
Carousel.prototype.onTweenComplete = function(nextIndex) 
{
	this.offsetX = 0;
	this.redrawBuffer();
	this.redraw();
	this.select();
}
Carousel.prototype.redraw = function()
{
  this.visibleContext.clearRect(this.offsetX,0,this.visibleCanvas.width,this.visibleCanvas.height); // clear canvas
  this.visibleContext.drawImage(this.bufferCanvas,this.offsetX,0);
}
Carousel.prototype.formURLWithImage = function(url)
{
	var arr = url.split("?");
	var base = arr[0];
	url = base+"?s="+this.itemWidth+"x"+this.itemHeight;
	return url;
}
Carousel.prototype.insertPlaceholder = function(payload) 
{
	var a = arguments;
	this.imageCounter++;
	//console.log("added "+payload.index+" x="+this.getX(payload.index) + " count="+payload.count);
	this.buffer.drawImage(payload.image, this.getX(payload.index), 0);
	this.visibleContext.drawImage(payload.image, this.getX(payload.index), 0);
	if(this.imageCounter > (payload.count - 1))
	{
		this.subscr.dispose();
		this.imageCounter = 0;
	}
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

