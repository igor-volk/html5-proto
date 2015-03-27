function CarouselService()
{
	
}
CarouselService.prototype.load = function()
{
	var request = new XMLHttpRequest();
	request.addEventListener("load", this.onLoad.bind(this), false);
	request.addEventListener("error", this.onError.bind(this), false);
	request.open('GET', 'https://trial.qs.skystore.com/api/device2/v2/catalog/assets?response=chunky&filter=^A&includecharindex=true&api_key=admin-p0wn3d', true);
	request.send();
	return request;
}
CarouselService.prototype.onLoad = function(e)
{
	//this.carouselLoaded.dispatch(e.target.response);
}
CarouselService.prototype.onError = function(e)
{
	
}