(function(){

	var abbr;

    $.getJSON("photos.json", function(data) { //get json object of full photo data
        abbr = data.abbr; //load abbreviations from json into abbr variable
        $.each(data.photos, makeFig); //for each photo in the array, run the makeFig function
        
        	slidingFilters();
        	initIso();
        	initPhotoswipe();
        	initHoverTitles();
    });

	//intialize Photoswipe
	function initPhotoswipe() {
		//parse thumbs
		function parseThumbElements(el) {
			var thumbElements = $(el).children(':not(.isotope-hidden,.logo)').get(); //is .get() necessary?
			var items = [];
			var figureEl, linkEl, size, item;
			for (var i = 0 ; i < thumbElements.length ; i++) {
				figureEl = thumbElements[i];
				if (figureEl.nodeType !== 1) {
					continue;
				}
				linkEl = figureEl.children[0];
				//console.log(figureEl);
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
		//find nearest parent
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
	        // find index of clicked item by looping through all child nodes
	        var clickedGallery = clickedListItem.parentNode,
	            childNodes = $(clickedListItem.parentNode).children(':not(.isotope-hidden)').get(),
	            numChildNodes = childNodes.length,
	            //nodeIndex = 0,
	            index;
	            // console.log(clickedGallery);
	            // console.log(childNodes);
	            // console.log(numChildNodes);
	        for (var i = 0; i < numChildNodes; i++) {
	        	//console.log(childNodes[i].nodeType);
	            if(childNodes[i].nodeType !== 1) { 
	                continue; 
	            }
	            if(childNodes[i] === clickedListItem) {
	                index = i; //why minus 1 now?
	                //console.log(i);
	                break;
	            }
	            //nodeIndex++;
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
	        //console.log(options);
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
	    	masonry: {
	    		columnWidth: 120
	    	},
	    	getSortData: {},
	    	stamp: '.stamp',
	    	//transitionDuration: '0.4s'
	    });
	    

	    $('#filters').on('mouseover', 'button', function() { // mouseover or click
	    	container.isotope({filter:$(this).attr('data-filter')});
	    	$('button').css('font-weight','normal');
	    	$(this).css('font-weight','bold');
	    	//$(this).css('background-color','#ccc'); //narrow rule to members of .btn-default, add rule to reset all others to white/default/inherit
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
		//debugger;
		var logoLocation = 7
		if (index === logoLocation) {
			var logo = "<div class='isoitem logo'><h1>SEDONA<br>STONE<br>VENEER</h1></div>";
			$('.isotope').append(logo);
		}
		if (index > logoLocation) {
			index = index -1;
		}
	    var divId = 'pic' + index; //crete a unique HTML id for the div, based on index value
	    var aspect = obj.aspect;
	    var imgSrc = 'img/' + aspect +'/' + obj.src + '.jpg'; //create the thumbnail url 
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
	    var thumb_width, thumb_height;
	    if (aspect[0] === '1') {
	    	thumb_width = '120';
	    } else if (aspect[0] === '2') {
	    	thumb_width = '240';
	    }
	    if (aspect[2] === '1') {
	    	thumb_height = '120';
	    } else if (aspect[2] === '2') {
	    	thumb_height = '240';
	    }
	    //combine all info to make a figure html element 
	   	var html = "<figure id='" + divId + "' class='" + classes + "'><a href='" + fullSrc + "' type='image/jpeg' data-size='" + obj.full_width + "x" + obj.full_height + "'><img class='img-' src='"+ imgSrc + "' width='" + thumb_width + "' height='" + thumb_height + "'><h4>" + stoneString + "<br>" + colorString + "</h4></a><figcaption>Stone: " + stoneString + ". Color: " + colorString + "</figcaption></figure>";
	   	$('.isotope').append(html); //append the new figure element to the isotope div
	}

	function initHoverTitles() {
		$('figure').hover(function(){
			$(this).find('h4').css("display","inline");
		},
		function(){
			$(this).find('h4').css("display","none");
		});
	}

	function slidingFilters() {
		$('.toggle1').slideToggle('slow');
		$('.toggle2').slideToggle('slow');
		$('.main1').mouseover(function(){
			$('.toggle1').slideDown('slow');
			$('.toggle2').slideUp('slow');
		});
		$('.main2').mouseover(function(){
			$('.toggle2').slideDown('slow');
			$('.toggle1').slideUp('slow');
		});
		//$('.isotope').isotope
	}

})();
