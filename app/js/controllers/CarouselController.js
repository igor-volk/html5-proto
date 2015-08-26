function CarouselController(view, service)
{
	this.view = view;
	//this.buildFakeView();
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
CarouselController.prototype.buildFakeView = function()
{
	var carouselVO = {};
	carouselVO.content = {};
	carouselVO.content.assets = [];
	for(var i=0;i<140;i++)
	{
		carouselVO.content.assets[i] = {};
		carouselVO.content.assets[i].links = [];
		carouselVO.content.assets[i].links[0] = {};
		carouselVO.content.assets[i].links[0].href = "http://lorempixel.com/193/275/fashion/"+(i%10);

	}
	this.view.build(carouselVO);
}