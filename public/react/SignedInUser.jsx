var SignedInUser = React.createClass({
	render: function () {
		return (
			<div className="signed-in-user">
				<span>{this.props.userFullName}</span>
				<a href="#" onClick={this.props.handleSignOutClick}>Sign out</a>
			</div>
		);
	}
});
