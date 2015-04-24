let React = require('react');
let d3 = require('d3');
let _ = require('underscore');

// Graph variables
let width, height;
let data, force;
let kudos, root, node, link;
let xPos, yPos, name;

// Variables to determine x, y, width, height
// Based on a radius used for circles/images
const BASE_RADIUS = 20;
const ROOT_RADIUS = BASE_RADIUS * 3;
const PARENT_RADIUS = BASE_RADIUS * 1.5;
const LEAF_RADIUS = BASE_RADIUS * 1.5;

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
		height = window.innerHeight - 50;

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

	// Updates the hub per tick
	tick() {
		link.attr('x1', (d) => { return d.source.x; })
			.attr('y1', (d) => { return d.source.y; })
			.attr('x2', (d) => { return d.target.x; })
			.attr('y2', (d) => { return d.target.y; });

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

	// To set x, y, width, height, offset
	setSize(d) {
		if (d.isRoot) return ROOT_RADIUS;
		else if (d.children || d._children) return PARENT_RADIUS;
		return LEAF_RADIUS;
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

		// Enter any new nodes
		node
			.enter()
			.append('g')
			.attr('class', 'node')
			.call(force.drag)
			.append('image')
			.attr('class', (d) => {
				return d.username || '';
			})
			.attr('xlink:href', (d) => {
				if (!d.children && !d._children) {
					return `../images/${d.username}.png`;
				} else {
					return `../images/${d.name}.png`;
				}
			})
			.attr('x', (d) => this.setSize(d)*(-1))
			.attr('y', (d) => this.setSize(d)*(-1))
			.attr('width', (d) => this.setSize(d)*2)
			.attr('height', (d) => this.setSize(d)*2)
			.on('mouseover', function (d) {
				let fullname = kudos
					.append('text');

				fullname
					.attr('id', 'text')
					.attr('dx', d.x)
					.attr('dy', d.y + 5)
					.style('fill', '#000')
					.text(d.name ? d.name.toUpperCase() : d.fullname);

				// Used to determine offset for different radii
				let offset = this.setSize(d);

				// To position the text in proportion to node
				let bbox = fullname.node().getBBox();
				fullname.attr('dx', d.x - bbox.width/2);
				fullname.attr('dy', d.y + offset + bbox.height);
			}.bind(this))
			.on('mouseout', function (d) {
				let parent = document.getElementById('svg');
				let texts = document.getElementById('text');

				// Remove the text
				parent.removeChild(texts);
			})
			.on('click', this.click);

		// Exit any old nodes
		node.exit().remove();

		dpd.on('kudos:created', (kudo) => {
			// Transition node (tricky)
			let leaf = d3.select(`.node .${kudo.recipient}`);
			let originalSize = leaf.attr('width');
			let originalXPos = leaf.attr('x');
			let originalYPos = leaf.attr('y');

			// Transit the size and position of image
			leaf.transition()
				.duration(200)
				.attr('width', + originalSize + 100)
				.attr('height', + originalSize + 100)
				.attr('x', originalXPos - 50)
				.attr('y', originalYPos - 50)
				.transition()
				.attr('width', originalSize)
				.attr('height', originalSize)
				.attr('x', originalXPos)
				.attr('y', originalYPos);
		});
	},

	render() {
		return (<div className="team-graph"></div>);
	}
});
