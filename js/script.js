var abbr; //only way to get abbr into global scope?

$(document).ready( function () {
	$.getJSON("photos.json", function(data){ //get json object of full photo data
		abbr = data.abbr; //load abbreviations from json into abbr variable
		$.each(data.photos,makeDiv); //for each photo in the array, run the makeDiv function
	});
});

function makeDiv (index,obj) { //get the index number of the array and the object with photo info
	var divId = 'pic' + index;  //crete a unique HTML id for the div, based on index value
	var imgSrc = 'thumb/' + obj.src; //create the thumbnail url 
	var fullSrc = 'full/' + obj.src; //create the full image url
	//var stoneClassArray = obj.stone;
	var stoneClassString = obj.stone.join(' ');
	var colorClassString = obj.color.join(' ');
	console.log(colorClassString);
	 // $.each(obj.stone,function(key,val) {
	 // 	//stoneClassArray.push(val);
	 // 	stoneClassArray
	 // });
	//console.log(stoneClassArray);
	//$.each(obj.stone,convertAbbr);
	//console.log(abbr);
}

function convertAbbr (i,shortName) {
	//
	return abbr[shortName];
}