document.addEventListener('polymer-ready', function() 
{
      var navigation = new Navigation(document.querySelector("x-navigation"));
      var carousel = new Carousel(document.querySelector("x-carousel"));
      var carouselController = new CarouselController(carousel);
});

