let React = require('react');
let moment = require('moment');

module.exports = React.createClass({
	render() {
		let isoDate = this.props.date;
		let fullDate = moment(isoDate).format('ddd, D MMM YYYY [at] h:mma');
		let relativeDate = moment(isoDate).fromNow();
		let userImg = `../images/${this.props.author.username}.png`;

		return (
			<div className="kudo">
				<img src={userImg} />
				<div className="kudo-info">
					<span className="kudo-author">{this.props.author.fullname}</span>
					<span className="kudo-text">{this.props.children}</span>
					<time className="kudo-date" datetime={isoDate} title={fullDate}>
						{relativeDate}
					</time>
				</div>
			</div>
		);
	}
});
