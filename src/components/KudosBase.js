let React = require('react');
let KudosForm = require('./KudosForm');
let KudosList = require('./KudosList');

module.exports = React.createClass({
	render() {
		if (!this.props.selectedUser) {
			document.body.classList.remove('box-open');

			return (<div className='kudos-box hidden'></div>);
		}

		document.body.classList.add('box-open');

		return (
			<div className='kudos-box'>
				<a href="#" className="close-kudos-box" onClick={this.props.handleHideBox}>&times;</a>
				<h2>
					<img src={this.props.selectedUser && 'images/' +
						this.props.selectedUser.username + '.png'}/>
					<span className="kudos-user">{this.props.selectedUser &&
						this.props.selectedUser.fullname}</span>
				</h2>
				<KudosForm selectedUser={this.props.selectedUser} handleSubmit={this.props.handleFormSubmit}/>
				<KudosList data={this.props.data} selectedUser={this.props.selectedUser}/>
			</div>
		);
	}
});
