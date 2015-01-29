var UsersList = React.createClass({
	getInitialState: function () {
		return { data: [] };
	},

	componentDidMount: function () {
		dpd.users.get(function (users) {
			this.setState({ data: users });
		}.bind(this));
	},

	handleUserClick: function (user, event) {
		event.preventDefault();
		console.log('handleuserclick');
		React.render(<KudosBox data={kudosData} selectedUser={user} />, document.querySelector('aside'));
	},

	render: function () {
		var nodes = this.state.data.map(function (user) {
			return (
				<li><a href="#" onClick={this.handleUserClick.bind(this, user)}>{user.fullname}</a></li>
			);
		}.bind(this));

		return (
			<ul className="users-list">{nodes}</ul>
		);
	}
});
