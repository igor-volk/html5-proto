function CarouselService()
{
	
}
CarouselService.prototype.load = function()
{
	var request = new XMLHttpRequest();
	
	//'http://localhost:1337/'
	//request.open('GET', 'http://qs.int.skystore.com/api/youviewP3/v2/catalog/assets/genre/122c15c9-0ae5-4ced-8dd0-3e788654d817?sort=%2DDVDReleaseDate&response=chunky&api_key=devices-D3bt', true);
	request.open('GET', 'https://catalogue-feed-proxy.herokuapp.com/v2/brands/go/devices/pc/navigation/nodes/12324de959d77410VgnVCM1000000b43150a____?represent=%28parent/node,child/page%28item-group/item-group%28item/item-summary%29%29%29');
	//request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.send();
	return request;
}