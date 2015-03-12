document.addEventListener('polymer-ready', function() 
{
	require.config({
	 	paths: {
	 		tweenLite: "http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenLite.min",
	 		easePack: "http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/easing/EasePack.min.",
	 		signal:"libs/js-signals/src/Signal",
	 		signalBinding:"libs/js-signals/src/SignalBinding",
	 		wrapper:"libs/js-signals/src/wrapper",
	 		Carousel:"views/Carousel",
	 		Navigation:"views/Navigation",
	 		CarouselController:"controllers/CarouselController",
	 		CarouselService:"services/CarouselService",
	 		CarouselItem:'views/CarouselItem'

		},
		shim: {
			tweenLite: {
				deps:["easePack"],
				exports: "TweenLite"
			},
			wrapper:{
				deps:["signalBinding", "signal"],
			},
			signal:{
				deps:["signalBinding"],
				exports:"signal"
			},
			CarouselController:{
				deps:["CarouselService","signal"]
			},
			CarouselService:{
				deps:["signal"]
			},
			Carousel:{
				deps:["signal","CarouselItem"]
			},
			CarouselItem:{
				deps:["signal"]
			}
			// colours:{
			// 	exports:"Colours"
			// },
			// carousel:{
			// 	exports:"Carousel"
			// },
			// navigation:{
			// 	exports:"Navigation"
			// },
			// carousel:{
			// 	exports:"Carousel"
			// },

		}
	});

	requirejs(["Navigation","Carousel","CarouselController","CarouselService"],
		function() {
			var navComp = document.querySelector("x-navigation");
			var navigation = new Navigation(navComp);
			var carouselComp = document.querySelector("x-carousel");
    		var carousel = new Carousel(carouselComp);
    		var carouselService = new CarouselService();
    		var carouselController = new CarouselController(carousel, carouselService);
		}
	);
    
});

