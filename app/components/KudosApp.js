// This is the main parent component which holds the other subcomponents
// and stores the state of the application.

let React = require('react');
let CurrentUserBox = require('./CurrentUserBox');
let LoginForm = require('./LoginForm');
let KudosBox = require('./KudosBox');
let TeamGraph = require('./TeamGraph');

let KudosApp = React.createClass({
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
			if (user) this.setLoginState(user);
		});
	},

	setLoginState(user) {
		// Get the data (kudos and user details) for all users and also specify
		// the logged-in user in the state
		dpd.users.get((users) => {
			this.setState({
				currentUser: user,
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
				this.setLoginState(user);
			});
		});
	},

	handleLogout() {
		dpd.users.logout((res, err) => {
			if (err) throw err;

			// Remove all state and collection event listeners
			this.setState({
				currentUser: null,
				selectedUser: null,
				userData: null
			});

			dpd.off('kudos:created');
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

	handleFormSubmit(textNode) {
		if (!this.state.currentUser || !this.state.selectedUser) return;

		dpd.kudos.post({
			recipient: this.state.selectedUser.username,
			author: this.state.currentUser.username,
			text: textNode.value.trim()
		}, function () {
			textNode.value = ''; // empty the textarea
		});
	},

	render() {
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
