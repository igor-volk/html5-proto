function CarouselItem()
{
	this.width = 193;
	this.height = 275;
	this.x = 0;
}
CarouselItem.prototype.load = function(url)
{
	var arr = url.split("?");
	var base = arr[0];
	url = base+"?s="+this.width+"x"+this.height;
	var image = new Image();
	image.addEventListener("load", this.loadedHandler.bind(this, image));
	image.src = url;
}
CarouselItem.prototype.loadedHandler = function(image)
{
	this.onImageLoaded.dispatch(image, this.x);
}
CarouselItem.prototype.onImageLoaded = new Signal();