let React = require('react');
let d3 = require('d3');
let _ = require('underscore');

// Graph variables
let width, height;
let data, theme, o, force;
let kudos, root, node, link, oldColor, xPos, yPos, name;

let TeamGraph = React.createClass({
	// Render the component only the first time
	// (otherwise D3 keeps appending the SVG element)
	shouldComponentUpdate(nextProps, nextState) {
		return !this.props.data && nextProps.data;
	},

	// Setup the graph/append the svg
	init() {
		// Get the width and height of the viewport
		width = window.innerWidth - 50;
		height = window.innerHeight - 100;

		// Set the color scheme for the nodes
		theme = d3.scale.category20();
		o = d3.scale.ordinal().range(colorbrewer.Set3[12]);

		// Initialise the forces for the graph
		force = d3.layout.force()
			.on('tick', this.tick)
			// .charge((d) => { return d._children ? -d.size / 10000 : -500; })
			.charge(-250)
			.gravity(0.005)
			//.linkDistance(300)
			.linkDistance((d) => { return d.target._children ? 200 : 150; })
			.size([width, height]);

		// Append the actual svg
		kudos = d3.select('.team-graph').append('svg')
			.attr('id', 'svg')
			.attr('width', width)
			.attr('height', height);

		// Parse the data
		data = {
			name: 'dls',
			isRoot: true,
			children: []
		};

		let groupsMap = _.groupBy(this.props.data, (user) => { return user.teamname; });
		_.each(groupsMap, (value, key, list) => {
			data.children.push({
				name: key,
				_children: value
			});
		});

		root = data;
		root.fixed = true;
		root.px = width/2 - 50;
		root.py = height/2 - 25;

		console.log('Here\'s the root info: ', root);
	},

	color(d) {
		// return theme(d.name);
		return o(d.name);
	},

	tick() {
		link.attr('x1', (d) => { return d.source.x; })
			.attr('y1', (d) => { return d.source.y; })
			.attr('x2', (d) => { return d.target.x; })
			.attr('y2', (d) => { return d.target.y; });

		node.attr('cx', (d) => { return d.x; })
			.attr('cy', (d) => { return d.y; });

		// node.attr('transform', (d) => {
		// 	return 'translate(' + d.x + ',' + d.y + ')';
		// });
	},

	// Toggle children on click
	click(d) {
		if (d.isRoot) return;

		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			// Leaf node
			if (!d._children) {
				// Toggle sidebar
				console.log('Leaf node is clicked!');
				this.props.handleLeafNodeClick(d);
			}

			d.children = d._children;
			d._children = null;
		}

		this.update();
	},

	// Returns a list of all nodes under the root
	flatten(root) {
		let nodes = [], i = 0;

		let recurse = (node) => {
			if (node.children) {
				node.size = node.children.reduce((p, v) => {
					return p + recurse(v);
				}, 0);
			}

			if (!node.id) {
				node.id = ++i;
			}

			nodes.push(node);
			return node.size;
		};

		root.size = recurse(root);
		return nodes;
	},

	update() {
		let nodes = this.flatten(root);
		let links = d3.layout.tree().links(nodes);

		// Restart force layout
		force.nodes(nodes)
			.links(links)
			.start();

		// Update the links
		link = kudos
			.selectAll('line.link')
			.data(links, (d) => { return d.target.id; });

		// Enter any new links
		link.enter()
			.insert('svg:line', '.node')
			.attr('class', 'link')
			.attr('x1', (d) => { return d.source.x; })
			.attr('y1', (d) => { return d.source.y; })
			.attr('x2', (d) => { return d.target.x; })
			.attr('y2', (d) => { return d.target.y; });

		// Exit any old links
		link.exit().remove();

		// Update the nodes
		node = kudos
			.selectAll('circle.node')
			.data(nodes, (d) => { return d.id; })

		node.transition()
			// .style('fill', 'black')
			// .attr('r', 20);
			// .attr('r', (d) => { return d.children ? 45 : Math.sqrt(d.size) / 10; });
			// .attr('r', (d) => { return d.children ? 30 : d.size*10; });

		// Enter any new nodes
		let r = 20;
		node
			.enter()
			.append('svg:circle')
			.attr('class', (d) => {
				let classes = ['node'];
				d.username && classes.push(d.username);
				return classes.join(' ');
			})
			.attr('cx', (d) => { return d.x; })
			.attr('cy', (d) => { return d.y; })
			.attr('r', (d) => {
				if (d.isRoot) return d.r = r * 3;
				return d._children ? d.r = r * 2 : r
			})
				// return d.children ? 45 : Math.sqrt(d.size) / 10;
				// return d.children ? 30 : d.size*10;
			// })
			.style('fill', (d) => {
				// console.log('o', o);
				return o(d.name || d.teamname);
			})
			.on('click', this.click)
			.on('mouseover', function(d) {
				// console.log('hover', d.name || d.fullname);
				let offset = r;
				// let offset = d.children ? 45 : Math.sqrt(d.size) / 10;
				// let offset = d.children ? 30 : d.size*10;
				// name = d.name;
				xPos = d.x - offset/4;
				yPos = d.y;
				oldColor = d3.select(this).style('fill');
				d3.select(this).style('fill', 'black');
				let y = kudos
					.append('text')

					y.attr('id', 'text')
					.attr('dx', d.x)
					.attr('dy', d.y + 5)
					.style('fill', '#000')
					.text(d.name ? d.name.toUpperCase() : `${d.fullname} (${d.kudos.length})`);

				let bbox = y.node().getBBox();
				y.attr('dx', d.x - bbox.width/2);
				y.attr('dy', d.y + (d.r || offset) + bbox.height);
			})
			.on('mouseout', function(d) {
				d3.select(this).style('fill', oldColor);
				let parent = document.getElementById('svg');
				let texts = document.getElementById('text');
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

		dpd.on('kudos:created', (kudo) => {
			// Transition node (tricky)
			let node = d3.select('.node.' + kudo.recipient);
			let originalRadius = node.attr('r');

			node.transition()
				.duration(150)
				.attr('r', + originalRadius + 100)
				.transition()
				.attr('r', originalRadius);

			let flag = true;

			node.on('mouseover', function(d) {
				// console.log('hover', d.name || d.fullname);
				if (flag) d.kudos.push(kudo);
				let offset = 20;
				// let offset = d.children ? 45 : Math.sqrt(d.size) / 10;
				// let offset = d.children ? 30 : d.size*10;
				// name = d.name;
				// xPos = d.x - offset/4;
				// yPos = d.y;
				oldColor = d3.select(this).style('fill');
				d3.select(this).style('fill', 'black');
				let y = kudos
					.append('text')

					y.attr('id', 'text')
					.attr('dx', d.x)
					.attr('dy', d.y + 5)
					.style('fill', '#000')
					.text(d.name ? d.name.toUpperCase() : `${d.fullname} (${d.kudos.length})`);
					// .text('dudde!');
				// kudos.select('text').text('DSLFGHDFGKHDFG')
				let bbox = y.node().getBBox();
					y.attr('dx', d.x - bbox.width/2);
					y.attr('dy', d.y + (d.r || offset) + bbox.height);

				flag = false;
			});
		});
	},

	render() {
		if (!this.props.data) return (<div className="team-graph"></div>);

		this.init();
		this.update();

		return (
			<div className="team-graph"></div>
		);
	}
});

module.exports = TeamGraph;
