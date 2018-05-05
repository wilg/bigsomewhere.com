var Slideshow = Class.create({

// USAGE
//
//      <script type="text/javascript">
//      document.observe("dom:loaded", function() {
//          new Slideshow("slideshow", image_list).setImageDimensions(800, 340).setSlideDuration(2.0).start();
//      });
//      </script>
//
//  IMAGE LIST FORMAT
//
//     [{'src' : "image.jpg"}, 
//     {'src' : "image2.jpg", 'link' : "http://youtube.com", 'caption' : "What is up?"},
//     {'src' : "image2.jpg"}, ...]
//

    initialize: function(element_or_id, properties) {
        this.element = $(element_or_id);
        this.photoProperties = properties;
        this.slideDuration = 2.0;
        this.transitionDuration = 2.0;
        this.shuffle = true;
        this.currentSlide = 0;
        this.firstRun = true;
    },
        
    start: function() {
    	if (this.shuffle)
        	this.photoProperties.shuffle();
    	this.preloadImages();
    	this.insertImage(this.photoProperties.first(), true);
    },
    
    setImageDimensions: function(width, height) {
        this.imageWidth = width;
        this.imageHeight = height;
        return this;
    },
    
    setSlideDuration: function(dur) {
        this.slideDuration = dur;
        return this;
    },
    
    insertImage: function(properties, animated) {
        var src = properties["src"];
        var href = properties["href"];
        var caption = properties["caption"];
                
    	var theElement = new Element('img', { 'src': src, 'alt': "Slideshow Photo", "width" : this.imageWidth, "height" : this.imageHeight});
    	
        if (href != null && href != undefined)
             theElement = new Element('a', { 'href': href}).update(theElement);
             
        theElement = new Element('div', { 'class': "slideshow-image"}).update(theElement);
        if (caption != null && caption != undefined) {
            var captionElem = new Element('div', { "class" : "slideshow-caption"}).update(caption);
            theElement.insert(captionElem);
        }
        
    	var previousElement = this.element.down();
    	if (this.transitionDuration > 0 && this.firstRun == false) {
    		theElement.hide();
    		this.element.insert(theElement);
    		this.refreshCufon();
    		
    		t = this;
    		new Effect.Appear(theElement, {duration : this.transitionDuration, afterFinish: this.transitionFinished.bind(this, previousElement)});
    	}
    	else {
    	    this.firstRun = false;
    		this.element.update(theElement);
    		this.refreshCufon();
    		
    		this.displayWithTimeout();
    	}
    },
    
    refreshCufon : function() {
		if (Cufon)
    		Cufon.refresh();
    },
    
    transitionFinished : function(previousElement) {
		if (previousElement) {
			previousElement.remove();
		}
		this.displayWithTimeout();
    },
    
    displayWithTimeout: function() {
        window.setTimeout(this.displaySlide.bind(this), this.slideDuration * 1000);
    },
    
    displaySlide: function () {
    	if (this.currentSlide + 1 > this.photoProperties.size()) {
    		this.currentSlide = 0;
    	}

    	this.insertImage(this.photoProperties[this.currentSlide], true);
    	this.currentSlide++;
    },
    
    preloadImages : function () {
        var array = new Array;
        this.photoProperties.each(function(item) {
          array.push(item["src"]);
        });
        if (document.images) {
            var preload_image_object = new Image();
            array.each(function(image){
                preload_image_object.src = image;
            });
        }
    }
    
});

Array.prototype.shuffle = function(){
	this.sort(function() {return 0.5 - Math.random()})
}