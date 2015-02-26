var React = require('react');

var SignedOutUser = React.createClass({
	render: function () {
		return (
			<div><a href="#" onClick={this.props.handleSignInClick}>Sign in</a></div>
		);
	}
});

module.exports = SignedOutUser;
