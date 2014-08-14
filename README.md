Static HTML layout code for http://www.mypalmbeachpost.com/nationalparks

## Layout
The layout is the basis of a bootstrap code written for CMG's CMS Medley.

##Graphics
The map used in the story is a png image generated from TileMill. Due to some javascript restrictions of using maps on CMS, this lightweight option was chosen.

The point cordinates are scaled based on the lat/long of the parks

For instance, each park has a JSON array element in the following format in parks.json
``` 
		{
			"id": 1,
			"name": "Mound City",
			"fullName":"Mound City Group National Monument, Chillicothe, Ohio",
			"desc":"A monument devoted to the burial grounds and earthworks of a vanished culture – the 	prehistoric Hopewell Indians. Perhaps the biggest problem plaguing the park were the pesky ground squirrels, who would often dig into the mounds and disturb the artifacts and bones.",
			"lat":39.376196,
			"long":-83.006566,
			"photos":[
				{
					"src":"./img/cover2.jpg",
					"caption":"This is caption for this image"
				},
				{
					"src":"./img/img2.jpg",
					"caption":"This is caption for this image 2"
				}
			]
		}

```		

The points are laid out on the image using a D3 linear scale as follows. the extends are calculated using the lat/long extend of the map image
```
	var xScale = d3.scale.linear()
		.range([0,$w])
		.domain([-125.2881,-66.6211]);

	var yScale = d3.scale.linear()
		.range([0,$h])
		.domain([49.6676,25.5]);
```
