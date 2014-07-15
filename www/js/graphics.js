var mapDiv = null,
curr = 0;

var margin= {left:10,right:10,top:0,bottom:0},
	$w = 1000,
	$h = 553;

$(document).ready(function(){
	$('.carousel').carousel({ interval: false});
	$('#fakemap').click(showMap);
	var throttledResize = _.throttle(loadGraphics, 100);
	$(window).resize(throttledResize);
    pymChild = new pym.Child({ renderCallback: loadGraphics });
	loadGraphics();
});

function calcLayout(){
	var maxWidth = $(window).height()*.9/.553;
	$w= Math.min(997,$('#main').width()- margin.right -margin.left);
	$h= $w*.553; //maintaining aspect ratio

	var mainHeight= ($h+$('#prev').height())*1.02; //giving 2 percent margin
	$('#main')
	.css("min-height",mainHeight+'px')
	.css("height", mainHeight+'px')
	.css("min-width",$w+'px')
	.css("width",$w+'px');

	$('#thumbs')
	.css("width",$w+'px');

	$('#img-slideshow')
	.css("width",$w+'px')
	.css("height", $h-$('#fakemap').height()+'px');

	if($w<480)
	{
		$('#desc').remove();
	}
}

function nukeGraphics(){
	$('#map>*').remove();
	margin= {left:10,right:10,top:0,bottom:0},
	$w = 1000,
	$h = 553;

	$('#main').css("width","100%");
}

function loadGraphics(){
	nukeGraphics();
	calcLayout();
	//mapextendt in tilemill: -125.2881,24.2069,-66.6211,49.6676
	var xScale = d3.scale.linear()
		.range([0,$w])
		.domain([-125.2881,-66.6211]);

	var yScale = d3.scale.linear()
		.range([0,$h])
		.domain([49.6676,25.5]);


	mapDiv = d3.select('#map')
		.style("height",$h+'px')
		.style("width",$w+'px');

	//load data and draw park points	
	d3.json("./js/data/parks.json", function(error, data) {
		parkData =data.parks;

		var parkPoints = mapDiv.selectAll(".park")
		.data(parkData)
		.enter().append("circle")
		.attr("id",function(d,i){return "park"+i;})
		.attr("class","park")
		.style("fill",'#ff0000')
		.attr("r",5)
		.attr("cx",function(d){return xScale(d.long)})
		.attr("cy",function(d){return yScale(d.lat)+7});

		var labels= mapDiv.selectAll(".label")
		.data(parkData)
		.enter().append("text")
		.text(function(d){return d.name;})
		.attr("x", function(d){return xScale(d.long)+10})
		.attr("y",function(d){return yScale(d.lat)+12});	

		loadImgs();
	});

	//animate line drawing
	function AnimateAddLine(from,to){
		showMap();
		var line = d3.svg.line()
		.interpolate("cardinal")
		.x(function(d){ return xScale(d.long)})
		.y(function(d){return yScale(d.lat)+7});

		var id = 'path-'+from.id+'-'+to.id;
		var path= mapDiv.insert("path","circle")
		.attr("d",line([from,to]))
		.attr("id",id)
		.attr("stroke", "red")
		.attr("stroke-width",2);

		var totalLength = path.node().getTotalLength();

		path
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(1000)
		.ease("linear")
		.attr("stroke-dashoffset", 0);

		return path;
	};

	//animate line removal
	function AnimateRemoveLine(from,to){
		showMap();
		var id = '#path-'+from.id+'-'+to.id;
		var path = mapDiv.select(id);
		var totalLength = path.node().getTotalLength();

		path
		.transition()
		.duration(1000)
		.ease("linear")
		.attr("stroke-dashoffset", totalLength)
		.remove();
	};

	//click handler to move through parks
	d3.select("#next")
	.on("click", function(){
		if(parkData[curr+1])
		{
			//set all existing lines to lower opacity
			mapDiv.selectAll("path")
			.attr("stroke-opacity",".3");

			//now draw line to next park
			AnimateAddLine(parkData[curr],parkData[curr+1]);
			curr++;
			loadImgs();
		}
	});

	//click handler to go back
	d3.select("#prev")
	.on("click", function(){
		if(curr!=0)
		{
			AnimateRemoveLine(parkData[curr-1],parkData[curr]);
			curr--;

			var id = '#path-'+(curr)+'-'+(curr+1);
			d3.select(id)
			.transition()
			.duration(1500)
			.attr("stroke-opacity","1");

			loadImgs();
		}
	})
}


function updateCurrpark()
{
	var text = '<span class="bold">'+parkData[curr].fullName+"</span> : "+ parkData[curr].desc
	$('#desc').html(text);

	var h = $('#desc').height();
	$('#desc').css('bottom',h+10+'px');

	d3.selectAll('.park').attr("r",3);
	d3.select('#park'+curr).attr("r",7);
}

function loadImgs(){
	updateCurrpark();
	//remove all existing ones
	$('#thumbs img').remove();
	$('.carousel-inner .item').remove();
	var $currpark = _.where(parkData,{id: (curr+1)});
	_.each($currpark[0].photos, function(photo, index){
				var $imgNode = document.createElement('img');
				$imgNode.src = photo.src;
				$($imgNode).attr('data-idx',index);
				$('#thumbs').append($imgNode);

        var itemNode = document.createElement('div');
        $(itemNode).addClass("item");
        $(itemNode).append($($imgNode).clone());   

        var caption = document.createElement('div');
        $(caption).addClass('caption')
        caption.innerHTML = photo.caption;

        $(itemNode).append(caption);

        if(index == 0){
        	$(itemNode).addClass("active");
        }
        $('.carousel-inner').append(itemNode);
	});

	$('#thumbs img').on("click", function(){
				$('#img-slideshow').carousel(parseInt($(this).attr('data-idx')));
				hideMap();
	});
}

function showMap(){
	if($('#map').css("display")=="none"){
		$('#main #img-slideshow').hide(100, function() {
			$('#map').slideDown(500);
			$('#desc').show();
		});
	}
}

function hideMap(){
	if($('#map').css("display")!="none"){
		$('#map').slideUp(500, showImg);
		$('#desc').hide();
	}
	else{
		showImg();
	}
}

function showImg(){
	$('#main #img-slideshow').show();
}