let React = require('react');
let d3 = require('d3');
let _ = require('underscore');

// Graph variables
let width, height;
let data, theme, o, force;
let kudos, root, node, parent, leaf;
let link, oldColor, xPos, yPos, name;

module.exports = React.createClass({
	// Render the component only the first time
	// (otherwise D3 keeps appending the SVG element)
	shouldComponentUpdate(nextProps, nextState) {
		return !this.props.data && nextProps.data;
	},

	componentDidMount() {
		this.init();
		this.update();
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

		// Form the teams
		let groupsMap = _.groupBy(this.props.data, (user) => {
			return user.teamname;
		});
		_.each(groupsMap, (value, key, list) => {
			data.children.push({
				name: key,
				_children: value
			});
		});

		// Define the root node
		root = data;
		root.fixed = true;
		root.px = width/2 - 50;
		root.py = height/2 - 25;

		console.log('Here\'s the root info: ', root);
	},

	// Returns the color scheme
	color(d) {
		return o(d.name);
	},

	// Updates the hub per tick
	tick() {
		link.attr('x1', (d) => { return d.source.x; })
			.attr('y1', (d) => { return d.source.y; })
			.attr('x2', (d) => { return d.target.x; })
			.attr('y2', (d) => { return d.target.y; });

		// node.attr('cx', (d) => { return d.x; })
		// 	.attr('cy', (d) => { return d.y; });

		node.attr('transform', (d) => {
			return `translate(${d.x}, ${d.y})`;
		});
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
			.selectAll('.node')
			.data(nodes, (d) => { return d.id; })

		let r = 20;

		// Enter any new nodes
		node
			.enter()
			.append('g')
			.attr('class', 'node')
			.call(force.drag)
			.append('image')
			.attr('class', (d) => {
				return d.username && d.username;
			})
			.attr('xlink:href', (d) => {
				if (!d.children && !d._children) {
					return `../images/${d.username}.png`;
				} else {
					return `../images/empty.png`;
				}
			})
			.attr('x', (d) => {
				if (d.isRoot) return -r*3;
				else if (d.children || d._children) return -r*2;
				return -r*2.5;
			})
			.attr('y', (d) => {
				if (d.isRoot) return -r*3;
				else if (d.children || d._children) return -r*2;
				return -r*2.5;
			})
			.attr('width', (d) => {
				if (d.isRoot) return r*6;
				else if (d.children || d._children) return r*4;
				return r*5;
			})
			.attr('height', (d) => {
				if (d.isRoot) return r*6;
				else if (d.children || d._children) return r*4;
				return r*5;
			})
			.on('mouseover', function(d) {
				let fullname = kudos
					.append('text')

				fullname
					.attr('id', 'text')
					.attr('dx', d.x)
					.attr('dy', d.y + 5)
					.style('fill', '#000')
					.text(d.name ? d.name.toUpperCase() : d.fullname);

				let offset = 0;
				if (d.isRoot) {
					offset = r*3;
				} else if (d.children || d._children) {
					offset = r*2;
				} else {
					offset = r*2.5;
				}

				let bbox = fullname.node().getBBox();
				fullname.attr('dx', d.x - bbox.width/2);
				fullname.attr('dy', d.y + offset + bbox.height);
			})
			.on('mouseout', function(d) {
				let parent = document.getElementById('svg');
				let texts = document.getElementById('text');
				parent.removeChild(texts);
			})
			.on('click', this.click);

		// Exit any old nodes
		node.exit().remove();

		dpd.on('kudos:created', (kudo) => {
			// Transition node (tricky)
			let node = d3.select(`.node .${kudo.recipient}`);
			let originalSize = node.attr('width');

			node.transition()
				.duration(200)
				.attr('width', + originalSize + 100)
				.attr('height', + originalSize + 100)
				.transition()
				.attr('width', originalSize)
				.attr('height', originalSize);

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
		return (<div className="team-graph"></div>);
	}
});
