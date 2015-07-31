function CarouselController(view, service)
{
	this.view = view;
	//service.carouselLoaded.add(this.buildView.bind(this));
	var request = service.load();
	var source = Rx.Observable.fromEvent(request, "load")
	var subscription = source.subscribe(this.buildView.bind(this));
}

CarouselController.prototype.buildView = function(e)
{
	var jsonData = e.target.response;
	var carouselVO = JSON.parse(jsonData);
	this.view.build(carouselVO);
}