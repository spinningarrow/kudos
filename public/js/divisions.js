$(function () {
	var data, width, height, theme, o, force, kudos, node, link, root, oldColor, xPos, yPos, name;
	dpd.users.get(function (users) {
		// Compose data based on users array
		data = {
			name: 'dls',
			isRoot: true,
			children: []
		};
		var groupsMap = _.groupBy(users, function (user) {
			return user.teamname;
		});
		_.each(groupsMap, function (value, key, list) {
			data.children.push({
				name: key,
				_children: value
			});
		});


		// Get the width and height of the viewport
		width = $(document).width() - 50;
		height = $(document).height() - 100;

		// Set the color scheme for the nodes
		theme = d3.scale.category20();
		o = d3.scale.ordinal()
			.range(colorbrewer.Set3[12]);

		// Initialise the forces for the graph
		force = d3.layout.force()
			.on('tick', tick)
			// .charge(function (d) { return d._children ? -d.size / 10000 : -500; })
			.charge(-250)
			.gravity(0.005)
			.linkDistance(function (d) {
				// console.log('link distance', d)
				return d.target._children ? 200 : 150;
			})
			//.linkDistance(300)
			.size([width, height]);

		// Append the actual svg
		kudos = d3.select('#divisions').append('svg')
			.attr('id', 'svg')
			.attr('width', width)
			.attr('height', height);

		// Parse the data
		root = data;
		root.fixed = true;
		console.log(root);
		root.px = width/2 - 50;
		root.py = height/2 - 25;

		update();
	});


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
			// .style('fill', 'black')
			// .attr('r', 20);
			// .attr('r', function (d) { return d.children ? 45 : Math.sqrt(d.size) / 10; });
			// .attr('r', function (d) { return d.children ? 30 : d.size*10; });

		// Enter any new nodes
		var r = 20;
		node
			.enter()
			.append('svg:circle')
			.attr('class', function (d) {
				var classes = ['node'];
				d.username && classes.push(d.username);
				return classes.join(' ');
			})
			.attr('cx', function (d) {
				return d.x;
			})
			.attr('cy', function (d) {
				return d.y;
			})
			.attr('r', function (d) {
				if (d.isRoot) return d.r = r * 3;
				return d._children ? d.r = r * 2 : r
			})
				// return d.children ? 45 : Math.sqrt(d.size) / 10;
				// return d.children ? 30 : d.size*10;
			// })
			.style('fill', function (d) {
				// console.log('o', o);
				return o(d.name || d.teamname);
			})
			.on('click', click)
			.on('mouseover', function (d) {
				// console.log('hover', d.name || d.fullname);
				var offset = r;
				// var offset = d.children ? 45 : Math.sqrt(d.size) / 10;
				// var offset = d.children ? 30 : d.size*10;
				// name = d.name;
				xPos = d.x - offset/4;
				yPos = d.y;
				oldColor = d3.select(this).style('fill');
				d3.select(this).style('fill', 'black');
				var y = kudos
					.append('text')

					y.attr('id', 'text')
					.attr('dx', d.x)
					.attr('dy', d.y + 5)
					.style('fill', '#000')
					.text(d.name ? d.name.toUpperCase() : d.fullname + ' (' + d.kudos.length + ')');

				var bbox = y.node().getBBox();
				y.attr('dx', d.x - bbox.width/2);
				y.attr('dy', d.y + (d.r || offset) + bbox.height);

				var that = this;
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

	dpd.on('kudos:created', function (kudo) {
		// Transition node (tricky)
		var node = d3.select('.node.' + kudo.recipient);
		var originalRadius = node.attr('r');
		node.transition().duration(150).attr('r', +originalRadius + 100).transition().attr('r', originalRadius);
		var flag = true;

		node.on('mouseover',  function (d) {
			// console.log('hover', d.name || d.fullname);
			if (flag) d.kudos.push(kudo);
			var offset = 20;
			// var offset = d.children ? 45 : Math.sqrt(d.size) / 10;
			// var offset = d.children ? 30 : d.size*10;
			// name = d.name;
			// xPos = d.x - offset/4;
			// yPos = d.y;
			oldColor = d3.select(this).style('fill');
			d3.select(this).style('fill', 'black');
			var y = kudos
				.append('text')

				y.attr('id', 'text')
				.attr('dx', d.x)
				.attr('dy', d.y + 5)
				.style('fill', '#000')
				.text(d.name ? d.name.toUpperCase() : d.fullname + ' (' + d.kudos.length + ')');
				// .text('dudde!');
			// kudos.select('text').text('DSLFGHDFGKHDFG')
			var bbox = y.node().getBBox();
				y.attr('dx', d.x - bbox.width/2);
				y.attr('dy', d.y + (d.r || offset) + bbox.height);

			flag = false;
		});
	});

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
		if (d.isRoot) return;
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			// Leaf node
			if (!d._children) {
				// Toggle sidebar
				console.log('I am a leaf node');

				var kdbnode = React.createElement(KudosBox, { data: kudosData, selectedUser: d });
				var kdb = React.render(kdbnode, document.querySelector('aside'));
				kdb.setState({ hidden: false });
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
