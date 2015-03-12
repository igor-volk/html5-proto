function CarouselController(view, service)
{
	this.view = view;
	service.carouselLoaded.add(this.buildView.bind(this));
	service.load();
}

CarouselController.prototype.buildView = function(jsonData)
{
	var carouselVO = JSON.parse(jsonData)
	this.view.build(carouselVO);
}