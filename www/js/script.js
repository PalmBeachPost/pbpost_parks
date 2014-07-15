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
	var $secheight =Math.floor(Math.min($bgheight/2,$('#section2').width()/2));
	$('.header.withImg img').css('height', $secheight+'px');
	$('.header.withImg h2').css('width',$('#section2').width()-$secheight -30+'px')
}

function MedleyShiv(){
	$('.ad-leaderboard').first().remove();
}