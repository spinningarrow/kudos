var React = require('react');

module.exports = React.createClass({
	render() {
		return (
			<div className="kudo">
				<span className="kudo-author">{this.props.author}</span>
				<span className="kudo-text">{this.props.children}</span>
				<time className="kudo-date">{this.props.date}</time>
			</div>
		);
	}
});
