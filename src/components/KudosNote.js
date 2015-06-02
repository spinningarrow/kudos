let React = require('react');
let moment = require('moment');

module.exports = React.createClass({
	render() {
		let isoDate = this.props.date;
		let fullDate = moment(isoDate).format('ddd, D MMM YYYY [at] h:mma');
		let relativeDate = moment(isoDate).fromNow();
		let userImg = `../images/${this.props.username}.png`;

		return (
			<div className="kudo">
				<div>
					<img src={userImg}></img>
					<span className="kudo-author">{this.props.author}</span>
				</div>
				<span className="kudo-text">{this.props.children}</span>
				<time className="kudo-date" datetime={isoDate} title={fullDate}>
					{relativeDate}
				</time>
			</div>
		);
	}
});
