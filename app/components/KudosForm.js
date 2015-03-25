let React = require('react');

module.exports = React.createClass({
	handleSubmit(event) {
		event.preventDefault();
		this.props.handleSubmit(this.refs.kudoText.getDOMNode());
	},

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<textarea ref="kudoText" required></textarea>
				<button type="submit">Send Kudos!</button>
			</form>
		);
	}
});
