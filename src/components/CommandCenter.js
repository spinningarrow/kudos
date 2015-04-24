let React = require('react');

module.exports = React.createClass({
	handleSignInClick(event) {
		event.preventDefault();

		document.querySelector('input[placeholder="Username"]').focus();
	},

	handleSignOutClick(event) {
		event.preventDefault();

		this.props.handleLogout();
	},

	render() {
		if (this.props.user) {
			return (
				<div>
					<div className="signed-in-user">
						<span>{this.props.user.fullname}</span>
						<span><a href="#" onClick={this.handleSignOutClick}>Sign out</a></span>
					</div>
				</div>
			);
		}

		return (
			<div></div>
		);
	}
});
