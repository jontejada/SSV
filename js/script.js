var abbr; //only way to get abbr into global scope?

$(document).ready(function() {
    $.getJSON("photos.json", function(data) { //get json object of full photo data
        abbr = data.abbr; //load abbreviations from json into abbr variable
        $.each(data.photos, makeDiv); //for each photo in the array, run the makeDiv function
    });
});

function makeDiv(index, obj) { //get the index number of the array and the object with photo info
    var divId = 'pic' + index; //crete a unique HTML id for the div, based on index value
    var imgSrc = 'img/thumb/' + obj.src; //create the thumbnail url 
    var fullSrc = 'img/full/' + obj.src; //create the full image url
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
    //combine all info to make a figure html element 
   	var html = "<figure id='" + divId + "' class='isoitem'><a href='" + fullSrc + "'><img src='"+ imgSrc + "' width='264' height='264'><h4>" + stoneString + "<br>" + colorString + "</h4></a><figcaption>Stone: " + stoneString + ". Color: " + colorString + "</figcaption></figure>";
   	$('.isotope').append(html); //append the new figure element to the isotope div
}
