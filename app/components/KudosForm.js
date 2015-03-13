var React = require('react');

var KudosForm = React.createClass({
	handleSubmit: function (event) {
		event.preventDefault();
		this.props.handleSubmit(this.refs.kudoText.getDOMNode());
	},

	render: function () {
		return (
			<form onSubmit={this.handleSubmit}>
				<textarea ref="kudoText" required></textarea>
				<button type="submit">Send Kudos!</button>
			</form>
		);
	}
});

module.exports = KudosForm;
