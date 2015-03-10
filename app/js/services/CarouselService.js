function CarouselService()
{
	var request = new XMLHttpRequest();
	request.addEventListener("load", this.onLoad.bind(this), false);
	request.open('GET', 'https://trial.qs.skystore.com/api/device2/v2/catalog/assets?response=chunky&filter=^A&includecharindex=true&api_key=admin-p0wn3d', true);
}
CarouselService.prototype.onLoad = function(e)
{
	dispatchEvent(new CustomEvent("dataLoaded", {"detail":e.responseXML}))
}