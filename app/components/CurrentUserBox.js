var React = require('react');

var CurrentUserBox = React.createClass({
	handleSignOutClick: function (event) {
		event.preventDefault();
		this.props.handleLogout();
	},

	handleSignInClick: function (event) {
		event.preventDefault();
		$('input[placeholder="Username"]').focus();
	},

	render: function () {
		if (this.props.user) {
			return (
				<div>
					<div className="signed-in-user">
						<span>{this.props.user.fullname}</span>
						<a href="#" onClick={this.handleSignOutClick}>Sign out</a>
					</div>
				</div>
			);
		}

		return (
			<div>
				<a href="#" onClick={this.handleSignInClick}>Sign in</a>
			</div>
		);
	}
});

module.exports = CurrentUserBox;
