var KudosBox = React.createClass({
	render: function () {
		return (
			<div className="kudos-box">
				<h2>Kudos</h2>
				<KudosForm selectedUser={this.props.selectedUser} />
				<KudosList data={this.props.data} selectedUser={this.props.selectedUser} />
			</div>
		);
	}
});

var KudosList = React.createClass({
	render: function () {
		if (!this.props.selectedUser) {
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
				<Kudo author={author.fullname}>{kudo.text}</Kudo>
			);
		}.bind(this));

		return (
			<div className="kudos-list">
				{this.props.selectedUser && this.props.selectedUser.fullname}
				{nodes}
			</div>
		);
	}
});

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

			dpd.kudos.post({
				recipient: recipient,
				author: author,
				text: text
			});
		}.bind(this));
	},

	render: function () {
		return (
			<form onSubmit={this.handleSubmit}>
				<textarea ref="kudoText"></textarea>
				<button type="submit">Submit</button>
			</form>
		);
	}
});

var Kudo = React.createClass({
	render: function () {
		return (
			<div className="kudo">
				<h3 className="kudo-author">{this.props.author}</h3>
				<p className="kudo-text">{this.props.children}</p>
			</div>
		);
	}
});
