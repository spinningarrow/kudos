var React = require('react');

var KudosForm = React.createClass({
	handleSubmit: function (event) {
		event.preventDefault();

		// Get the current user's name
		dpd.users.me(function (user) {
			if (!user) {
				return;
			}

			var recipient = this.props.selectedUser.username;
			var author = user.username;
			var text = this.refs.kudoText.getDOMNode().value.trim();

			if (!text) return;

			dpd.kudos.post({
				recipient: recipient,
				author: author,
				text: text,
				date: new Date().toISOString()
			}, function () {
				this.refs.kudoText.getDOMNode().value = '';
			}.bind(this));
		}.bind(this));
	},

	render: function () {
		return (
			<form onSubmit={this.handleSubmit}>
				<textarea ref="kudoText"></textarea>
				<button type="submit">Send Kudos!</button>
			</form>
		);
	}
});

module.exports = KudosForm;
