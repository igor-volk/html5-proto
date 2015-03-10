function CarouselController(view)
{
	this.view = view;
	var service = new CarouselService();
	service.addEventListener("dataLoaded", this.buildView.bind(this));
	
}

CarouselController.prototype.buildView = function(xml)
{
	this.view.build(xml);
}