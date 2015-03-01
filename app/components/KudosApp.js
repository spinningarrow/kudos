// This is the main parent component which holds the other subcomponents and
// stores the state of the application

var React = require('react');
var CurrentUserBox = require('./CurrentUserBox');
var LoginForm = require('./LoginForm');
var KudosBox = require('./KudosBox');

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

		dpd.users.get(function (users) {
			this.setState({
				userData: users
			});
		}.bind(this));

		dpd.on('kudos:created', function (kudo) {
			dpd.users.get(function (users) {
				this.setState({
					userData: users
				});
			}.bind(this));
		}.bind(this));
	},

	handleLogin: function (username, password) {
		dpd.users.login({
			username: username,
			password: password
		}, function (res, err) {
			if (err) throw err;

			dpd.users.me(function (user) {
				this.setState({
					currentUser: user
				});
			}.bind(this));
		}.bind(this));
	},

	handleLogout: function () {
		dpd.users.logout(function (res, err) {
			if (err) throw err;

			this.setState({
				currentUser: null
			});
		}.bind(this));
	},

	render: function () {
		return (
			<div className="kudos-app">
				<header>
					<h1>Kudos</h1>
					<div className="current-user-badge">
						<CurrentUserBox user={this.state.currentUser} handleLogout={this.handleLogout}/>
					</div>
				</header>
				<main>
					{!this.state.currentUser && <LoginForm handleLogin={this.handleLogin}/>}
					<div id="divisions"></div>
					<aside>
						<KudosBox data={this.state.userData} selectedUser={this.state.currentUser}/>
					</aside>
				</main>
			</div>
		);
	}
});

module.exports = KudosApp;
