let React = require('react');
let ReactEmoji = require('react-emoji');
let moment = require('moment');

module.exports = React.createClass({
	mixins: [
		ReactEmoji
	],

	render() {
		let isoDate = this.props.date;
		let fullDate = moment(isoDate).format('ddd, D MMM YYYY [at] h:mma');
		let relativeDate = moment(isoDate).fromNow();

		return (
			<div className="kudo">
				<span className="kudo-author">{this.props.author}</span>
				<span className="kudo-text">{this.emojify(this.props.children, {
					attributes: {className: 'emoticon'}
				})}</span>
				<time className="kudo-date" datetime={isoDate} title={fullDate}>
					{relativeDate}
				</time>
			</div>
		);
	}
});
