$(document).ready(function(){
	calcLayout();
	MedleyShiv();
	var throttledResize = _.throttle(calcLayout, 100);
	$(window).resize(throttledResize);

	var pymparent = new pym.Parent('graphic', './img.html',{});
});

function calcLayout(){
	// calculate cover height
	var $bgheight=$(window).height();
	$('#coverholder').css('height', $bgheight+'px');
	var $secheight =$bgheight*.5;
	$('.header.withImg').css('height', $secheight+'px');

	/*var $mapWidth = $('#graphic').width();	
	$('#map').attr("width",$mapWidth+'px')
	.attr("height",$mapWidth*.65+'px');

	$('#graphic').css('height',$mapWidth*.8+'px');*/

/*
	//force an iframe reload
	var ifr = document.getElementById('map');
	ifr.src = ifr.src;*/
}

function MedleyShiv(){
	$('.ad-leaderboard').first().remove();
}