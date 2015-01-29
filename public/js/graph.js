$(function () {
	// Get the width and height of the viewport
	var width = $(document).width();
	var height = $(document).height();

	// Set the color scheme for the nodes
	var theme = d3.scale.category10();

	// Initialise the forces for the graph
	var force = d3.layout.force()
		.charge(-200)
		.gravity(0.05)
		.linkDistance(150)
		.size([width, height]);

	// Append the actual svg
	var kudos = d3.select("#graph").append("svg")
		.attr("width", width)
		.attr("height", height);

	// Parse the data
	var graph = data;
	force.nodes(graph.nodes)
		.links(graph.links)
		.start();

	// Initialise the edges
	var link = kudos
		.selectAll(".link")
		.data(graph.links)
		.enter()
		.append("line")
		.attr("class", "link")
		.style("stroke-width", function (d) {
			return Math.sqrt(d.value);
		});
	
	// Initialise the circles
	var node = kudos
		.selectAll(".node")
		.data(graph.nodes)
		.enter()
		.append("g")
		//.append("circle")
		.attr("class", "node")
		//.attr("r", 20)
		//.style("fill", function (d) { return theme(d.group); })
		.style("stroke", function (d) { return theme(d.group); })
		.call(force.drag);

	// dpd.users.get(function (result, err) {
	// 	if (err) {
	// 		return console.log(err);
	// 	}
	// 	console.log(result);
	// });

	node.on("click", function (d) {
		console.log(d.name + " is clicked.", arguments);
	});

	node.on("mouseover", function (d) {
		console.log(d.name + " is hovered", arguments);
	});

	node.append("clipPath")
		.attr("id", "clipped")
		.append("circle")
		.attr("r", function (d) { return d.radius || 20; });

	//node.append("filter")
		//.attr("id", "image")
		//.attr("height", 1)
		//.attr("width", 1)
		//.attr("patternUnits", "userSpaceOnUse")
		//.append("feImage")
		//.attr("width", 20)
		//.attr("height", 20)
		//.attr("xlink:href", "https://pbs.twimg.com/profile_images/536065384202240000/5Ufzo09P.jpeg");

	node.append("circle")
		.attr("r", function (d) { return d.radius || 20; })
		.attr("fill", "none");
		//.attr("filter", "url(#image)");
		//.style("fill", function (d) { return theme(d.group); });

	node.append("image")
		.attr("xlink:href", "https://pbs.twimg.com/profile_images/536065384202240000/5Ufzo09P.jpeg")
		.attr("x", function (d) { return -d.radius || -20; })
		.attr("y", function (d) { return -d.radius || -20; })
		//.attr("class", "photo")
		//.attr("style", "fill: red; stroke: blue; stroke-width: 3")
		//.style("stroke", "red")
		//.style("stroke-width", 10)
		.attr("width", function (d) { return d.radius*2 || 40; })
		.attr("height", function (d) { return d.radius*2 || 40; })
		.attr("clip-path", "url(#clipped)");
	
	node.append("text")
		.attr("dx", 20)
		.attr("dy", ".35em")
		.style("fill", "#000000")
		.text(function (d) {
			return d.name;
		});
	
	force.on("tick", function () {
		link.attr("x1", function (d) { return d.source.x; })
			.attr("y1", function (d) { return d.source.y; })
			.attr("x2", function (d) { return d.target.x; })
			.attr("y2", function (d) { return d.target.y; });
		
		//node.attr("cx", function (d) { return d.x; })
			//.attr("cy", function (d) { return d.y; });
		
		node.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	});
});