let React = require('react');
let Kudo = require('./Kudo');
let moment = require('moment');
let _ = require('underscore');

let KudosList = React.createClass({
	render() {
		if (!this.props.selectedUser || !this.props.data) return (<div />);

		let kudos = _.find(this.props.data, (user) => {
			return user.username === this.props.selectedUser.username;
		}).kudos;

		let nodes = kudos.map((kudo) => {
			// Get author's full name
			let users = this.props.data;
			let author = _.find(users, (user) => {
				return user.username === kudo.author;
			});

			return (
				<Kudo author={author.fullname}
					date={moment(kudo.date || new Date().toISOString()).fromNow()}>
					{kudo.text}</Kudo>
			);
		}).reverse();

		return (
			<div className="kudos-list">
				{nodes}
			</div>
		);
	}
});

module.exports = KudosList;
