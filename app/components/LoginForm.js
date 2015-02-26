var React = require('react');

var LoginForm = React.createClass({

	handleSubmit: function (event) {
		event.preventDefault();

		var username = this.refs.username.getDOMNode().value.trim();
		var password = this.refs.password.getDOMNode().value.trim();

		if (!username || !password) {
			return;
		}

		// Log the user in
		dpd.users.login({
			username: username,
			password: password
		}, function (result, error) {
			if (!error) {
				loginDone();
				return;
			}

			console.log('Login error', error);
		});

		this.refs.username.getDOMNode().value = '';
		this.refs.password.getDOMNode().value = '';

		return;
	},

	render: function () {
		return (
			<form className="login-form" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Username" required ref="username" /><br />
				<input type="password" placeholder="Password" required ref="password" /><br />
				<button type="submit">Sign In</button>
			</form>
		);
	}
});

module.exports = LoginForm;
