// This is the main parent component which holds the other subcomponents and
// stores the state of the application

var React = require('react');
var CurrentUserBox = require('./CurrentUserBox');
var LoginForm = require('./LoginForm');

var KudosApp = React.createClass({
	getInitialState: function () {
		return {
			currentUser: null
		};
	},

	componentDidMount: function () {
		// Check if the user is already signed in
		dpd.users.me(function (user) {
			if (user) {
				this.setState({
					currentUser: user
				});
			}
		}.bind(this));
	},

	handleLogin: function (username, password) {
		dpd.users.login({
			username: username,
			password: password
		}, function (res, err) {
			if (err) return;

			dpd.users.me(function (user) {
				this.setState({
					currentUser: user
				});
			}.bind(this));
		}.bind(this));
	},

	render: function () {
		return (
			<div className="kudos-app">
				<header>
					<h1>Kudos</h1>
					<div className="current-user-badge">
						<CurrentUserBox user={this.state.currentUser}/>
					</div>
				</header>
				<main>
					{!this.state.currentUser && <LoginForm handleLogin={this.handleLogin}/>}
				</main>
			</div>
		);
	}
});

module.exports = KudosApp;
