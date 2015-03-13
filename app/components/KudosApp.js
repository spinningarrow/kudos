// This is the main parent component which holds the other subcomponents and
// stores the state of the application

var React = require('react');
var CurrentUserBox = require('./CurrentUserBox');
var LoginForm = require('./LoginForm');
var KudosBox = require('./KudosBox');
var TeamGraph = require('./TeamGraph');

var KudosApp = React.createClass({
	getInitialState: function () {
		return {
			currentUser: null,
			selectedUser: null,
			userData: null
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

		// Get the data (kudos and user details) for all users
		dpd.users.get(function (users) {
			this.setState({
				userData: users
			});
		}.bind(this));

		// Update the data when a new kudo is created (either locally or from
		// another instance)
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

	handleHideBox: function (event) {
		event.preventDefault();

		this.setState({
			selectedUser: null
		});
	},

	handleLeafNodeClick: function (user) {
		this.setState({
			selectedUser: user
		});
	},

	handleFormSubmit: function (textNode) {
		if (!this.state.currentUser || !this.state.selectedUser) return;

		dpd.kudos.post({
			recipient: this.state.selectedUser.username,
			author: this.state.currentUser.username,
			text: textNode.value.trim()
		}, function () {
			textNode.value = ''; // empty the textarea
		});
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
					{this.state.currentUser && <TeamGraph data={this.state.userData} handleLeafNodeClick={this.handleLeafNodeClick}/>}
					<aside>
						<KudosBox data={this.state.userData}
							selectedUser={this.state.selectedUser}
							handleHideBox={this.handleHideBox}
							handleFormSubmit={this.handleFormSubmit}/>
					</aside>
				</main>
			</div>
		);
	}
});

module.exports = KudosApp;
