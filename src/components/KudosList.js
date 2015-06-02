let React = require('react');
let KudosNote = require('./KudosNote');
let _ = require('underscore');

module.exports = React.createClass({
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
				<KudosNote author={author.fullname}
					username={author.username}
					date={kudo.date || new Date().toISOString()}>
					{kudo.text}
				</KudosNote>
			);
		}).reverse();

		return (
			<div className="kudos-list">
				{nodes}
			</div>
		);
	}
});
