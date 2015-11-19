(function(){

	var abbr;

    $.getJSON("photos.json", function(data) { //get json object of full photo data
        abbr = data.abbr; //load abbreviations from json into abbr variable
        $.each(data.photos, makeFig); //for each photo in the array, run the makeFig function
        
        	initIso();
        	initPhotoswipe();
    });

	//intialize Photoswipe
	function initPhotoswipe() {
		//parse thumbs
		function parseThumbElements(el) {
			var thumbElements = $(el).children(':not(.isotope-hidden)').get(); //is .get() necessary?
			var items = [];
			var figureEl, linkEl, size, item;
			for (var i = 0 ; i < thumbElements.length ; i++) {
				figureEl = thumbElements[i];
				if (figureEl.nodeType !== 1) {
					continue;
				}
				linkEl = figureEl.children[0];
				size = linkEl.getAttribute('data-size').split('x');
				item = {
					src: linkEl.getAttribute('href'),
					w: parseInt(size[0],10),
					h: parseInt(size[1],10)
				};
				if (figureEl.children.length > 1) {
					item.title = figureEl.children[1].innerHTML;
				}
				item.msrc = figureEl.children[0].getAttribute('src');
				item.el = figureEl;
				items.push(item);
			}
			return items;
		}
		//find nearest parent (why?)
		function closest(el, fn) {
        	return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    	}
		//fn to start ps on click
	    var onThumbsClick = function(e) {
	        e = e || window.event;
	        e.preventDefault ? e.preventDefault() : e.returnValue = false;
	        var eTarget = e.target || e.srcElement;
	        // find root element of slide
	        //console.log(eTarget);
	        var clickedListItem = closest(eTarget, function(el) {
	            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
	        });
	        if(!clickedListItem) {
	            return;
	        }
	        console.log(clickedListItem);
	        // find index of clicked item by looping through all child nodes
	        var clickedGallery = clickedListItem.parentNode,
	            childNodes = $(clickedListItem.parentNode).children(':not(.isotope-hidden)').get(),
	            numChildNodes = childNodes.length,
	            nodeIndex = 0,
	            index;
	            console.log(childNodes);
	        for (var i = 0; i < numChildNodes; i++) {
	            if(childNodes[i].nodeType !== 1) { 
	                continue; 
	            }
	            if(childNodes[i] === clickedListItem) {
	                index = nodeIndex;
	                break;
	            }
	            nodeIndex++;
	        }	
	        if(index >= 0) {
	            openPhotoSwipe( index, clickedGallery );
	        }
	        return false;
	    };

		//start ps
		function openPhotoSwipe(index , galleryElement) {
			var pswpElement = $('.pswp')[0];
			var options = {
				index:index,
				history:false};
			var items = parseThumbElements(galleryElement);
			//options.index = parseInt(index, 10);
	        console.log(options);
			var gallery = new PhotoSwipe(pswpElement , PhotoSwipeUI_Default , items , options);
			gallery.init();
		}
		//set gallery elements
		var galleryElements = $('.isotope');
		//attach attr and click listener to gallery elements
		for (var i = 0 ; i < galleryElements.length ; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleryElements[i].onclick = onThumbsClick;
		}
	}

	//initialize Isotope
	function initIso() {
	    
	    //add & remove isotope-hidden class to figures
	    var itemReveal = Isotope.Item.prototype.reveal;
	    Isotope.Item.prototype.reveal = function() {
	        itemReveal.apply(this, arguments);
	        $(this.element).removeClass('isotope-hidden');
	    };
	    var itemHide = Isotope.Item.prototype.hide;
	    Isotope.Item.prototype.hide = function() {
	        itemHide.apply(this, arguments);
	        $(this.element).addClass('isotope-hidden');
	    };

	    //layout Isotope here
	    var container = $('.isotope');
	    container.isotope({ 
	    	itemSelector: '.isoitem', //isotope items are figure elements w/ isoitem class 
	    	layoutMode: 'masonry',
	    	getSortData: {},
	    	//transitionDuration: '0.4s'
	    });
	    
	    $('#filters').on('mouseover', 'button', function() {
	    	container.isotope({filter:$(this).attr('data-filter')});
	    });
	    $('.button-group').each( function( i, buttonGroup ) {
	    	var $buttonGroup = $( buttonGroup );
	    	$buttonGroup.on( 'mouseover', 'button', function() {
	      		$buttonGroup.find('.is-checked').removeClass('is-checked');
	      		$( this ).addClass('is-checked');
	    	});
	  	});
	}

	//generate html for a figure element & append it to the isotope div element
	function makeFig(index, obj) { //get the index number of the array and the object with photo info
	    var divId = 'pic' + index; //crete a unique HTML id for the div, based on index value
	    var imgSrc = 'img/thumb/' + obj.src + '.jpg'; //create the thumbnail url 
	    var fullSrc = 'img/full/' + obj.src + '.jpg'; //create the full image url
	    var stoneString = '';
	    $.each(obj.stone, function(key, val) { //build stoneString 
	        if (stoneString === '') {
	            stoneString = abbr[val];
	        } else {
	            stoneString += ' & ' + abbr[val];
	        }
	    });
	    var colorString = '';
	    $.each(obj.color, function(key, val) { //build colorString
	        if (colorString === '') {
	            colorString = abbr[val];
	        } else {
	            colorString += ' & ' + abbr[val];
	        }
	    });
	    var classes = 'isoitem';
	    $.each(obj.stone, function(key, val) {
	    	classes += ' ' + val;
	    });
	    $.each(obj.color, function(key, val) {
	    	classes += ' ' + val;
	    });
	    //combine all info to make a figure html element 
	   	var html = "<figure id='" + divId + "' class='" + classes + "'><a href='" + fullSrc + "' type='image/jpeg' data-size='" + obj.full_width + "x" + obj.full_height + "'><img src='"+ imgSrc + "' width='" + obj.thumb_width + "' height='" + obj.thumb_height + "'><h4>" + stoneString + "<br>" + colorString + "</h4></a><figcaption>Stone: " + stoneString + ". Color: " + colorString + "</figcaption></figure>";
	   	$('.isotope').append(html); //append the new figure element to the isotope div
	}

})();
