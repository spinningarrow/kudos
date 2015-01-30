var KudosBox = React.createClass({
	getInitialState: function () {
		return { hidden: true };
	},

	hideBox: function (event) {
		event.preventDefault();

		this.setState({ hidden: true });
	},

	render: function () {
		$('body').toggleClass('box-open', !this.state.hidden);
		return (
			<div className={ this.state.hidden ? 'kudos-box hidden' : 'kudos-box' }>
				<a href="#" className="close-kudos-box" onClick={this.hideBox}>&times;</a>
				<h2>
					<img src={this.props.selectedUser && 'images/' + this.props.selectedUser.username + '.jpg'} />
					<span className="kudos-user">{this.props.selectedUser && this.props.selectedUser.fullname}</span>
				</h2>
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

var Kudo = React.createClass({
	render: function () {
		return (
			<div className="kudo">
				<span className="kudo-author">{this.props.author}</span>
				<span className="kudo-text">{this.props.children}</span>
				<time className="kudo-date">{this.props.date}</time>
			</div>
		);
	}
});
