var React = require('react');

module.exports = React.createClass({
	handleSubmit(event) {
		event.preventDefault();

		let username = this.refs.username.getDOMNode().value.trim();
		let password = this.refs.password.getDOMNode().value.trim();

		if (!username || !password) return;

		this.props.handleLogin(username, password);

		// Reset the username and password fields
		this.refs.username.getDOMNode().value = '';
		this.refs.password.getDOMNode().value = '';

		return;
	},

	render() {
		return (
			<div className="login-form">
				<form onSubmit={this.handleSubmit}>
					<input type="text" placeholder="Username" required ref="username" /><br />
					<input type="password" placeholder="Password" required ref="password" /><br />
					<button type="submit">Sign In</button>
				</form>
			</div>
		);
	}
});
