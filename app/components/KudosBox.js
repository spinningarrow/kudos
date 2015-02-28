var React = require('react');
var KudosForm = require('./KudosForm');
var KudosList = require('./KudosList');

var KudosBox = React.createClass({
	hideBox: function (event) {
		event.preventDefault();

		// this.setState({ hidden: true });
	},

	render: function () {
		return (
			<div className={ 'kudos-box' }>
				<a href="#" className="close-kudos-box" onClick={this.hideBox}>&times;</a>
				<h2>
					<img src={this.props.selectedUser && 'images/' + this.props.selectedUser.username + '.jpg'}/>
					<span className="kudos-user">{this.props.selectedUser && this.props.selectedUser.fullname}</span>
				</h2>
				<KudosForm selectedUser={this.props.selectedUser}/>
				<KudosList data={this.props.data} selectedUser={this.props.selectedUser}/>
			</div>
		);
	}
});

module.exports = KudosBox;
