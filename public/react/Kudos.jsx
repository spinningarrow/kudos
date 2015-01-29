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
		var nodes = this.props.data.filter(function (kudo) {
			if (this.props.selectedUser) {
				return kudo.recipient === this.props.selectedUser.username;
			} else {
				return true;
			}
		}.bind(this)).map(function (kudo) {
			return (
				<Kudo author={kudo.author}>{kudo.text}</Kudo>
			);
		});

		return (
			<div className="kudos-list">
				selected user: {this.props.selectedUser && this.props.selectedUser.username}
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
