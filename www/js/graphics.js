var mapDiv = null,
curr = 0;
$(document).ready(function(){
	var margin= {left:10,right:10,top:0,bottom:0},
	width = 1000,
	height = 553;

	var maxWidth = $(window).height()*.9/.553;
	width= Math.min(997,$('#main').width()- margin.right -margin.left,maxWidth);
	height= width*.553; //maintaining aspect ratio

	d3.select('#main')
	.style("min-height",height+'px')
	.style("height", height+'px')
	.style("min-width",width+'px')
	.style("width",width+'px');
	//mapextendt in tilemill: -125.2881,24.2069,-66.6211,49.6676
	var xScale = d3.scale.linear()
		.range([0,width])
		.domain([-125.2881,-66.6211]);

	var yScale = d3.scale.linear()
		.range([0,height])
		.domain([49.6676,25.5]);


	mapDiv = d3.select('#map')
		.style("height",height+'px')
		.style("width",width+'px');

	//load data and draw park points	
	d3.json("./js/data/parks.json", function(error, data) {
		parkData =data.parks;

		var points = mapDiv.selectAll(".park")
		.data(parkData)
		.enter().append("circle")
		.attr("class","park")
		.style("fill",'#ff0000')
		.attr("r",5)
		.attr("cx",function(d){return xScale(d.long)})
		.attr("cy",function(d){return yScale(d.lat)+7})
		.style("z-index",100);

		var labels= mapDiv.selectAll(".label")
		.data(parkData)
		.enter().append("text")
		.text(function(d){return d.name;})
		.attr("x", function(d){return xScale(d.long)+10})
		.attr("y",function(d){return yScale(d.lat)+12});

		layoutThumbs();
	});

	//animate line drawing
	function AnimateAddLine(from,to){
		showMap();
		var line = d3.svg.line()
		.interpolate("cardinal")
		.x(function(d){ return xScale(d.long)})
		.y(function(d){return yScale(d.lat)+7});

		var id = 'path-'+from.id+'-'+to.id;
		var path= mapDiv.append("path")
		.attr("d",line([from,to]))
		.attr("id",id)
		.attr("stroke", "red")
		.attr("stroke-width",2)
		.style("z-index",0);

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
			layoutThumbs();
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

			layoutThumbs();
		}
	})
});

function layoutThumbs(){
	//remove all existing ones
	$('#thumbs img').remove();
	var $currpark = _.where(parkData,{id: (curr+1)});
	_.each($currpark[0].photos, function(photo, index){
		var $imgNode = document.createElement('img');
		$imgNode.src = photo.src;
		$('#thumbs').append($imgNode);
	});

	$('#thumbs img').on("click", function(){
				$('#img img').remove();
				$('#main #img')
				.css("display","none")
				.append(
					$(this).clone()
					
				);
				hideMap();
	});
}

function showMap(){
	if($('#map').css("display")=="none"){
		$('#main #img').hide(100, function() {
			$('#map').slideDown(500);
		});
	}
}

function hideMap(){
	if($('#map').css("display")!="none"){
		$('#map').slideUp(500, showImg);
	}
	else{
		showImg();
	}
}

function showImg(){
	$('#main #img').show();
}