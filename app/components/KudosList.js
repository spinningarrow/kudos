var React = require('react');
var Kudo = require('./Kudo');

var KudosList = React.createClass({
	render: function () {
		if (!this.props.selectedUser || !this.props.data) {
			return (<div />);
		}

		var kudos = _.find(this.props.data, function (user) {
			return user.username === this.props.selectedUser.username;
		}, this).kudos;

		var nodes = kudos.map(function (kudo) {
			// Get author's full name
			var users = this.props.data;
			var author = _.find(users, function (user) {
				return user.username === kudo.author;
			});

			return (
				<Kudo author={author.fullname} date={moment(kudo.date || new Date().toISOString()).fromNow()}>{kudo.text}</Kudo>
			);
		}.bind(this)).reverse();

		// Highlight nodes which commented on this user
		// var authors = _.uniq(_.pluck(kudos, 'author'));
		// _.each(authors, function (author) {
		// 	var d3node = d3.select('.node.' + author);
		// 	var oldColor;
		// 	try {
		// 		oldColor = d3Node.style('fill');
		// 	} catch (e) {}
		// 	d3node.style('fill', 'blue');
		// });

		return (
			<div className="kudos-list">
				{nodes}
			</div>
		);
	}
});

module.exports = KudosList;
