var KudosBox = React.createClass({
	render: function () {
		return (
			<div>
				<h2>Kudos</h2>
				<KudosForm />
				<KudosList data={this.props.data} />
			</div>
		);
	}
});

var KudosList = React.createClass({
	render: function () {
		var nodes = this.props.data.map(function (kudo) {
			return (
				<Kudo author={kudo.author}>{kudo.text}</Kudo>
			);
		});

		return (
			<div className="kudos-list">
				{nodes}
			</div>
		);
	}
});

var KudosForm = React.createClass({
	render: function () {
		return (
			<div>Kudos form</div>
		);
	}
});

var Kudo = React.createClass({
	render: function () {
		return (
			<div className="kudo">
				<h3 class="kudo-author">{this.props.author}</h3>
				<p class="kudo-text">{this.props.children}</p>
			</div>
		);
	}
});
