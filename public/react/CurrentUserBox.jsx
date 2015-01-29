var CurrentUserBox = React.createClass({
	getInitialState: function () {
		return {user: {}};
	},

	componentDidMount: function () {
		dpd.users.me(function (user) {
			this.setState({user: user ? user.fullname : ''});
		}.bind(this));
	},

	handleSignOutClick: function (event) {
		event.preventDefault();

		dpd.users.logout(function (result, error) {
			if (!error) {
				this.setState({ user: '' });
			}
		}.bind(this));
	},

	handleSignInClick: function (event) {
		event.preventDefault();

		// Focus the username field
		$('input[placeholder="Username"]').focus();
	},

	render: function () {
		return (
			<div>
				{ this.state.user ? <SignedInUser userFullName={this.state.user} handleSignOutClick={this.handleSignOutClick} /> :
					<SignedOutUser handleSignInClick={this.handleSignInClick} /> }
			</div>
		);
	}
});
