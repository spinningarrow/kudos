// This is the main parent component which holds the other subcomponents
// and stores the state of the application.

var React = require('react');
var CurrentUserBox = require('./CurrentUserBox');
var LoginForm = require('./LoginForm');
var KudosBox = require('./KudosBox');
var TeamGraph = require('./TeamGraph');

var KudosApp = React.createClass({
	getInitialState() {
		return {
			currentUser: null,
			selectedUser: null,
			userData: null
		};
	},

	componentDidMount() {
		// Check if the user is already signed in
		dpd.users.me((user) => {
			if (user) {
				this.setState({
					currentUser: user
				});
			}
		});

		// Get the data (kudos and user details) for all users
		dpd.users.get((users) => {
			this.setState({
				userData: users
			});
		});

		// Update the data when a new kudo is created
		// (either locally or from another instance)
		dpd.on('kudos:created', (kudo) => {
			dpd.users.get((users) => {
				this.setState({
					userData: users
				});
			});
		});
	},

	handleLogin(username, password) {
		dpd.users.login({
			username: username,
			password: password
		}, (res, err) => {
			if (err) throw err;

			dpd.users.me((user) => {
				this.setState({
					currentUser: user
				});
			});
		});
	},

	handleLogout() {
		dpd.users.logout((res, err) => {
			if (err) throw err;

			this.setState({
				currentUser: null
			});
		});
	},

	handleHideBox(event) {
		event.preventDefault();

		this.setState({
			selectedUser: null
		});
	},

	handleLeafNodeClick(user) {
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
						<CurrentUserBox user={this.state.currentUser}
							handleLogout={this.handleLogout}/>
					</div>
				</header>
				<main>
					{!this.state.currentUser &&
						<LoginForm handleLogin={this.handleLogin}/>}
					{this.state.currentUser &&
						<TeamGraph data={this.state.userData}
							handleLeafNodeClick={this.handleLeafNodeClick}/>}
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