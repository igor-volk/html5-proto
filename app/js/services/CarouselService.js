function CarouselService()
{
	
}
CarouselService.prototype.load = function()
{
	var request = new XMLHttpRequest();
	
	request.addEventListener("load", this.onLoad.bind(this), false);
	request.addEventListener("error", this.onError.bind(this), false);
	request.open('GET', 'http://localhost:1337/'+'qs.int.skystore.com/api/youviewP3/v2/catalog/assets/genre/122c15c9-0ae5-4ced-8dd0-3e788654d817?sort=%2DDVDReleaseDate&response=chunky&api_key=devices-D3bt', true);
	request.setRequestHeader("Access-Control-Allow-Origin", "*");
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