function Carousel(view)
{

	this.images = [];
	this.itemData = [];
	this.itemWidth = 193;
	this.itemHeight = 275;
	this.NUMBER_OF_ITEMS = 6;
	this.SPACING = 16;
	this.VANISHING_POINT_LEFT = 2;
	this.numberOfItems = 0;
	this.selectedIndex = 0;
	this.itemOffsetIndex = 0;
	this.currentX = 0;
	this.offsetX = 0;
	this.tweenSpeed = 0.8;

	this.visibleCanvas = view.getCarousel();
	this.visibleContext = this.visibleCanvas.getContext("2d");

	this.selectionCanvas = view.getSelection();
	this.selectionContext = this.selectionCanvas.getContext("2d");

	this.bufferCanvas = document.createElement('canvas');
	this.buffer = this.bufferCanvas.getContext("2d");
	this.bufferCanvas.width = 1698;//this.visibleCanvas.width;
	this.bufferCanvas.height = this.visibleCanvas.height;

	document.getElementById('container').appendChild(this.bufferCanvas);

	this.selection = new Image();
	this.placeholder = new Image();
	this.imageCounter = 0;
}

Carousel.prototype.build = function(carouselVO)
{
	this.selection.src = "asset/img/all/highlight_item.png";
	this.placeholder.src = "asset/img/all/default_placeholder_193x275.png";

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

	
}
Carousel.prototype.makeLoader = function(val, i, observ)
{
	var a = arguments;
	var url = this.formURLWithImage(this.itemData[i].links[0].href);
	var image = new Image();
	image.src = url;
	this.images[i] = image;

	return this.createImageLoadStream(image, i, observ.source.count, url);
}
Carousel.prototype.createImageLoadStream = function(image, index, count, url) 
{
	var scope = this;
	var placeholder = this.placeholder;
	
	var errorStream = Rx.Observable.fromEvent(image,"error", function(args) {
		return {image:placeholder, index:index, count:count, url:url};
	});

	var loadStream = Rx.Observable.fromEvent(image,"load", function(args) {
		console.log("loaded image "+scope.selectedIndex);
		return {image:args[0].target, index:index, count:count, url:url};
	} );

	var dataStream = loadStream.merge(errorStream);

	return dataStream;
}
Carousel.prototype.addImage = function(payload) 
{
	var a = arguments;
	this.imageCounter++;
	//console.log("added "+payload.index+" x="+this.getX(payload.index) + " count="+payload.count);
	this.drawToBuffer(payload.image, this.getX(payload.index));
	
	if(this.imageCounter > (payload.count - 1))
	{
		this.subscr.dispose();
		this.imageCounter = 0;
		this.redraw();
	}
}
Carousel.prototype.navigateRight = function()
{
	if(this.selectedIndex == (this.itemData.length - 1)) return;

	this.deselect();
	this.selectedIndex++
	//var packshotIndex = this.selectedIndex % this.NUMBER_OF_ITEMS;
	console.log("navigateRight -> selectedIndex="+this.selectedIndex);
	var nextX = this.itemWidth + this.SPACING;
	var redraw = this.redraw.bind(this);
	var selectItem = this.selectItem.bind(this);
	var nextIndexToLoad = this.selectedIndex + this.NUMBER_OF_ITEMS - 1;

	this.recycleNextRight(nextIndexToLoad).subscribe(this.addToBufferRight.bind(this));
	if(this.tween)
	{
		this.onTweenComplete();
	}
	
	//var onTweenComplete = this.onTweenComplete.bind(this);
	var select = this.select.bind(this);
	this.tween = TweenLite.to(this, this.tweenSpeed, {offsetX:-(nextX), onUpdate:redraw, onComplete:select});//, onComplete:onTweenComplete
}
Carousel.prototype.recycleNextRight = function(nextIndex)
{
	var loaderToRecycle = this.images.shift();
	this.images.push(loaderToRecycle);
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	var lastIndex = this.images.length - 1;
	var placeholder = this.placeholder;
	console.log("placeholder for index "+this.selectedIndex);
	this.addToBufferRight({image:placeholder, index:lastIndex});
	
	return this.createImageLoadStream(loaderToRecycle, lastIndex, 0, loaderToRecycle.src);
}
Carousel.prototype.addToBufferRight = function(payload) 
{
	var lastIndex = payload.index;
	var image = payload.image;
	var newX = this.getX(lastIndex + 1);
	console.log("add to buffer right: index - "+lastIndex+" x - "+ newX);
	this.drawToBuffer(image,newX);
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
	if(this.tween)
	{
		this.onTweenComplete();
	}
	
	//var onTweenComplete = this.onTweenComplete.bind(this);
	var select = this.select.bind(this);
	this.tween = TweenLite.to(this, this.tweenSpeed, {offsetX:(nextX), onUpdate:redraw, onComplete:select});
}
Carousel.prototype.addToBufferLeft = function(payload) 
{
	var image = payload.image;
	var newX = -209;
	this.drawToBuffer(image,newX,0);
}
Carousel.prototype.recycleNextLeft = function(nextIndex) 
{
	var loaderToRecycle = this.images.pop();
	this.images.unshift(loaderToRecycle);
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	var placeholder = this.placeholder;
	this.addToBufferLeft({image:placeholder, index:0});

	return this.createImageLoadStream(loaderToRecycle, 0, 0, loaderToRecycle.src);
}
Carousel.prototype.onTweenComplete = function() 
{
	this.offsetX = 0;
	this.redrawBuffer();
	this.redraw();
	//this.select();
	this.tween.kill();
	this.tween = null;
}
Carousel.prototype.drawToBuffer = function(image, newX)
{
	this.buffer.drawImage(image,newX + 209,0);
}
Carousel.prototype.redrawBuffer = function() 
{
	var image;
	this.buffer.clearRect(0,0,this.bufferCanvas.width,this.bufferCanvas.height);
	for(var i=0; i<this.images.length; i++)
	{
		image = this.images[i];
		var newX = this.getX(i);
		if(image.width > 0) this.drawToBuffer(image,newX);
		else this.drawToBuffer(this.placeholder,newX);
	}
}
Carousel.prototype.redraw = function()
{
  this.visibleContext.clearRect(0,0,this.visibleCanvas.width,this.visibleCanvas.height); // clear canvas
  this.visibleContext.drawImage(this.bufferCanvas,this.offsetX - 209,0);
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
	this.drawToBuffer(payload.image, this.getX(payload.index));
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

