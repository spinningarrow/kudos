var KudosBox = React.createClass({
	render: function () {
		return (
			<div>
				<h2>Kudos</h2>
				<KudosList />
				<KudosForm />
			</div>
		);
	}
});

var KudosList = React.createClass({
	render: function () {
		return (
			<div>Kudos list</div>
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
