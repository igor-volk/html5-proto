document.addEventListener('polymer-ready', function() 
	{
		Rx.config.longStackSupport = true;
		
		var navComp = document.querySelector("x-navigation");
		var navigation = new Navigation(navComp);
		var carouselComp = document.querySelector("x-carousel");
		var carousel = new Carousel(carouselComp);
		var carouselService = new CarouselService();
		var carouselController = new CarouselController(carousel, carouselService);

		var selectedItem = navigation;

		var source = Rx.Observable.fromEvent(document, "keydown");
		var subscription = source.subscribe(function onKeyDown(event) {
			switch (event.keyCode) 
			{
				case 37:
				//left
			        selectedItem.navigateLeft();
			        break;
			    case 38:
			    	selectedItem.deselect();
			        selectedItem = navigation;
			        selectedItem.select();
			        //up
			        break;
			    case 39:
			        selectedItem.navigateRight();
			        //right
			        break;
			    case 40:
			    	selectedItem.deselect();
			        selectedItem = carousel;
			        selectedItem.select();
			        //down
			        break;
			}
		});
	}
);

