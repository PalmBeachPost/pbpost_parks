$(document).ready(function(){
	calcLayout();
	MedleyShiv();
	var throttledResize = _.throttle(calcLayout, 100);
	$(window).resize(throttledResize);
});

function calcLayout(){
	// calculate cover height
	$bgheight=$(window).height();
	$('#coverholder').css('height', $bgheight+'px');
	$secheight =$bgheight*.5;
	$('.header').css('height', $secheight+'px');
}

function MedleyShiv(){
	$('.ad-leaderboard').first().remove();
}