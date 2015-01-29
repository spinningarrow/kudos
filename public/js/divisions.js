$(function () {
	// Get the width and height of the viewport
	var width = $(document).width();
	var height = $(document).height();

	// Set the color scheme for the nodes
	var theme = d3.scale.category20();
	var o = d3.scale.ordinal()
	    .range(colorbrewer.Set3[12]);

	// Initialise the forces for the graph
	var force = d3.layout.force()
		.on('tick', tick)
		.charge(function (d) { return d._children ? -d.size / 10000 : -500; })
		// .charge(-50)
		.gravity(0.05)
		.linkDistance(function (d) { return d.source._children ? 800 : 300; })
		.size([width, height]);

	// Append the actual svg
	var kudos = d3.select('#divisions').append('svg')
		.attr('id', 'svg')
		.attr('width', width)
		.attr('height', height);

	// Parse the data
	var node, link;
	var root = divisions;
	var oldColor, xPos, yPos, name;
	// root.fixed = true;

	update();

	function update() {
		var nodes = flatten(root);
		var links = d3.layout.tree().links(nodes);

		// Restart force layout
		force.nodes(nodes)
			.links(links)
			.start();

		// Update the links
		link = kudos
			.selectAll('line.link')
			.data(links, function(d) { return d.target.id; });

		// Enter any new links
		link.enter()
			.insert('svg:line', '.node')
			.attr('class', 'link')
			.attr('x1', function (d) { return d.source.x; })
			.attr('y1', function (d) { return d.source.y; })
			.attr('x2', function (d) { return d.target.x; })
			.attr('y2', function (d) { return d.target.y; });

		// Exit any old links
		link.exit().remove();

		// Update the nodes
		node = kudos
			.selectAll('circle.node')
			.data(nodes, function(d) { return d.id; })

		node.transition()
			.attr('r', 45);
			// .attr('r', function (d) { return d.children ? 45 : Math.sqrt(d.size) / 10; });
			// .attr('r', function (d) { return d.children ? 30 : d.size*10; });

		// Enter any new nodes
		node
			.enter()
			.append('svg:circle')
			.attr('class', 'node')
			.attr('cx', function (d) { return d.x; })
			.attr('cy', function (d) { return d.y; })
			.attr('r', 45)
				// return d.children ? 45 : Math.sqrt(d.size) / 10;
				// return d.children ? 30 : d.size*10;
			// })
			.style('fill', function (d) { return o(d.name); })
			.on('click', click)
			.on('mouseover', function (d) {
				var offset = 45;
				// var offset = d.children ? 45 : Math.sqrt(d.size) / 10;
				// var offset = d.children ? 30 : d.size*10;
				name = d.name;
				xPos = d.x - offset/4;
				yPos = d.y;
				oldColor = d3.select(this).style('fill');
				d3.select(this).style('fill', 'black');
				kudos
					.append('text')
					.attr('id', 'text')
					.attr('dx', xPos)
					.attr('dy', yPos)
					.style('fill', '#FFFFFF')
					.text(name);
			})
			.on('mouseout', function (d) {
				d3.select(this).style('fill', oldColor);
				var parent = document.getElementById('svg');
				var texts = document.getElementById('text');
				parent.removeChild(texts);
			})
			.call(force.drag);

		// newNode
			// .append('circle')
			// .on('mouseover', hover(newNode))

		// newNode
		// 	.append('clipPath')
		// 	.attr('id', 'clipped')
		// 	.append('circle')
		// 	.attr('r', function (d) { return d.children ? 30 : d.size*15; });

		// newNode
		// 	.append('image')
		// 	// .attr('xlink:href', function (d) { return '../images/' + d.name + '.png'; })
		// 	.attr('xlink:href', 'https://pbs.twimg.com/profile_images/536065384202240000/5Ufzo09P.jpeg')
		// 	.attr('clip-path', 'url(#clipped)')
		// 	.attr('x', function (d) {
		// 		return d.children ? -30 : d.size*(-15);
		// 	})
		// 	.attr('y', function (d) {
		// 		return d.children ? -30 : d.size*(-15);
		// 	})
		// 	.attr('width', function (d) {
		// 		return d.children ? 60 : d.size*30;
		// 	})
		// 	.attr('height', function (d) {
		// 		return d.children ? 60 : d.size*30;
		// 	})

		// newNode
		// 	.append('text')
		// 	.attr('dx', function (d) { return d.children ? 5 : Math.min(30, (d.x - d.size*15/2)); })
		// 	.attr('dy', '.35em')
		// 	.style('fill', '#000000')
		// 	.text(function (d) { return d.children ? '' : d.name; });

		// Exit any old nodes
		node.exit().remove();
	};

	function tick() {
		link.attr('x1', function (d) { return d.source.x; })
			.attr('y1', function (d) { return d.source.y; })
			.attr('x2', function (d) { return d.target.x; })
			.attr('y2', function (d) { return d.target.y; });

		node.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });

		// node.attr('transform', function (d) {
		// 	return 'translate(' + d.x + ',' + d.y + ')';
		// });
	};

	function color(d) {
		// return theme(d.name);
		return o(d.name);
	};

	// Toggle children on click
	function click(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			// Leaf node
			if (!d._children) {
				// Toggle sidebar
				console.log('I am a leaf node');
			}

			d.children = d._children;
			d._children = null;
		}
		update();
	};

	// Returns a list of all nodes under the root
	function flatten(root) {
		var nodes = [], i = 0;

		function recurse(node) {
			if (node.children) {
				node.size = node.children.reduce(function (p, v) {
					return p + recurse(v);
				}, 0);
			}

			if (!node.id) {
				node.id = ++i;
			}

			nodes.push(node);
			return node.size;
		}

		root.size = recurse(root);
		return nodes;
	};
});