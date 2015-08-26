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
	Rx.config.longStackSupport = true;

	this.selection.src = "asset/img/all/highlight_item.png";
	this.placeholder.src = "asset/img/all/default_placeholder_193x275.png";

	this.itemData = carouselVO.content.assets;

	var currentX = 0;
	var numItems = (this.NUMBER_OF_ITEMS<this.itemData.length) ? this.NUMBER_OF_ITEMS : this.itemData.length;

	this.subscr = Rx.Observable.range(0, numItems)
	.map(this.makeLoader.bind(this))
	.mergeAll()       //.map(this.addImage.bind(this))
	.subscribe(this.addImage.bind(this));

	
}
Carousel.prototype.makeLoader = function(val, i, observ)
{
	var a = arguments;
	var url = this.formURLWithImage(this.itemData[i].links[0].href);
	var image = new Image();
	image.title = this.itemData[i].title;
	image.src = url;
	this.images[i] = image;

	return this.createImageLoadStream(image, i, 0, observ.source.count, url);
}
Carousel.prototype.createImageLoadStream = function(image, indexToLoad, currentSelectedIndex, count, url) 
{
	var scope = this;
	var placeholder = this.placeholder;
	console.log("createImageLoadStream for "+image.title+" :: indexToLoad - "+indexToLoad);

	var errorStream = Rx.Observable.fromEvent(image,"error", function(args) {
		console.log("failed "+scope.itemData[indexToLoad].title+" indexToLoad "+indexToLoad+" currentSelectedIndex "+currentSelectedIndex);
		return {image:placeholder, indexToLoad:indexToLoad, currentSelectedIndex:currentSelectedIndex, count:count, url:url};
	});

	var loadStream = Rx.Observable.fromEvent(image,"load", function(args) {
		console.log("loaded "+scope.itemData[indexToLoad].title+" indexToLoad "+indexToLoad+" currentSelectedIndex "+currentSelectedIndex);
		return {image:args[0].target, indexToLoad:indexToLoad, currentSelectedIndex:currentSelectedIndex, count:count, url:url};
	} );

	var dataStream = loadStream.merge(errorStream).first();

	return dataStream;
}
Carousel.prototype.addImage = function(payload) 
{
	var a = arguments;
	this.imageCounter++;
	this.drawToBuffer(payload.image, this.getX(payload.indexToLoad));
	
	if(this.imageCounter > (payload.count - 1))
	{
		this.subscr.dispose();
		this.imageCounter = 0;
		this.redrawVisible();
	}
}
Carousel.prototype.navigateRight = function()
{
	if(this.selectedIndex == (this.itemData.length - 1)) return;

	this.deselect();
	this.selectedIndex++;
	//var packshotIndex = this.selectedIndex % this.NUMBER_OF_ITEMS;
	
	var nextX = this.itemWidth + this.SPACING;
	var redrawVisible = this.redrawVisible.bind(this);
	var nextIndexToLoad = this.selectedIndex + this.NUMBER_OF_ITEMS - 1;
	console.log("navigateRight -> nextIndexToLoad="+nextIndexToLoad);

	this.recycleNextRight(nextIndexToLoad).subscribe(this.addToBufferRight.bind(this));

	if(this.tween)
	{
		this.onTweenComplete();
		//return;
	}
	
	var onTweenComplete = this.onTweenComplete.bind(this);
	var select = this.select.bind(this);
	this.tween = TweenLite.to(this, this.tweenSpeed, {offsetX:-(nextX), onUpdate:redrawVisible, onComplete:onTweenComplete});
}

Carousel.prototype.recycleNextRight = function(nextIndex)
{
	var loaderToRecycle = this.images.shift();
	this.images.push(loaderToRecycle);
	loaderToRecycle.title = this.itemData[nextIndex].title;
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	var placeholder = this.placeholder;
	var selectedIndex = this.selectedIndex;
	//this.addToBufferRight({image:placeholder, indexToLoad:nextIndex, currentSelectedIndex:selectedIndex, count:0, url:""});
	
	return this.createImageLoadStream(loaderToRecycle, nextIndex, selectedIndex, 0, loaderToRecycle.src);
}
Carousel.prototype.addToBufferRight = function(payload)
{
	var image = payload.image;
	var packshotIndex;
	if(payload.currentSelectedIndex == this.selectedIndex)
	{
		packshotIndex = this.images.length - 1;
		console.log("addToBufferRight: (NORM)"+image.title+" index = "+payload.indexToLoad+" packshot = "+packshotIndex);
	}
	else
	{
		var diff = this.selectedIndex - payload.currentSelectedIndex;
		packshotIndex = (this.images.length - 1) - diff;
		console.log("addToBufferRight (LATE by "+diff+") : "+image.title+" index = "+payload.indexToLoad+" packshot = "+packshotIndex);
	}
	var newX = this.getX(packshotIndex + 1);
	this.drawToBuffer(image,newX);
}
Carousel.prototype.onTweenComplete = function() 
{
	this.redrawAll();
	if(this.tween)
	{
		this.tween.kill();
		this.tween = null;
	}
	console.log("Tween Complete, selected item is "+this.itemData[this.selectedIndex].title)
}
Carousel.prototype.redrawAll = function() 
{
	this.offsetX = 0;
	this.redrawBuffer();
	this.redrawVisible();
	this.select();
	console.log("redrawAll, selected item is "+this.itemData[this.selectedIndex].title)
}

Carousel.prototype.drawToBuffer = function(image, newX)
{
	var actX = newX + 209;
	console.log("drawToBuffer "+image.title+" at actual x = "+actX);
	this.buffer.drawImage(image,actX,0);
}
Carousel.prototype.redrawBuffer = function() 
{
	var image;
	this.buffer.clearRect(0,0,this.bufferCanvas.width,this.bufferCanvas.height);
	for(var i=0; i<this.images.length; i++)
	{
		image = this.images[i];
		var newX = this.getX(i);
		this.drawToBuffer(image,newX);
	}
}
Carousel.prototype.redrawVisible = function()
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
Carousel.prototype.getX = function(i)
{
	return (this.itemWidth + this.SPACING) * i;
}
Carousel.prototype.select = function()
{
	this.selectItem(this.selectedIndex);
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


Carousel.prototype.navigateLeft = function()
{
	if(this.selectedIndex == 0) return;

	this.deselect();
	this.selectedIndex--;
	var redrawVisible = this.redrawVisible.bind(this);
	var nextX = this.itemWidth + this.SPACING;
	var nextIndexToLoad = this.selectedIndex;
	console.log("navigateRight -> nextIndexToLoad="+nextIndexToLoad);

	this.recycleNextLeft(nextIndexToLoad).subscribe(this.addToBufferLeft.bind(this));
	if(this.tween)
	{
		this.onTweenComplete();
	}
	
	var onTweenComplete = this.onTweenComplete.bind(this);
	var select = this.select.bind(this);
	this.tween = TweenLite.to(this, this.tweenSpeed, {offsetX:(nextX), onUpdate:redrawVisible, onComplete:select});
}
Carousel.prototype.recycleNextLeft = function(nextIndex) 
{
	var loaderToRecycle = this.images.pop();
	this.images.unshift(loaderToRecycle);
	loaderToRecycle.src = this.formURLWithImage(this.itemData[nextIndex].links[0].href);
	var placeholder = this.placeholder;
	var selectedIndex = this.selectedIndex;
	this.addToBufferLeft({image:placeholder, indexToLoad:nextIndex, currentSelectedIndex:selectedIndex, count:0, url:""});

	return this.createImageLoadStream(loaderToRecycle, nextIndex, selectedIndex, 0, loaderToRecycle.src);
}
Carousel.prototype.addToBufferLeft = function(payload) 
{
	var image = payload.image;
	var newX;
	if(payload.currentSelectedIndex == this.selectedIndex)
	{
		newX = -209;
	}
	else
	{
		newX = -209 + (209 * (payload.currentSelectedIndex - this.selectedIndex));
	}
	
	this.drawToBuffer(image,newX,0);
}

