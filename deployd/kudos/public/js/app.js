$(function () {
	console.log('dom ready.');

	// --- Login page ---
	// Do something when the form is submitted
	$('#login-form').submit(function () {

		var username = $('#username').val();
		var password = $('#password').val();

		dpd.users.login({ username: username, password: password });

		return false;
	});

	// --- Data page ---
	// Show the current user's name
	dpd.users.me(function (user) {
		$('#currentuser').html(user.username);

		// Submit a new kudo
		$('#kudos-create').submit(function () {
			var recipient = $('#recipient').val();
			var text = $('#kudo-text').val();
			var author = user.username;

			dpd.kudos.post({
				recipient: recipient,
				author: author,
				text: text
			});

			return false;
		});

		// Display all kudos, grouped by user
		dpd.users.get(function (users) {
			// $('#kudos-list').html(JSON.stringify(users));
			var $list = $('<ul/>');
			var $items = users.map(function (user) {
				var kudosHtml = user.kudos.map(function (kudo) {
					return '<li>' +
						kudo.author +
						': ' + kudo.text +
						'</li>';
				}).join('');
				return '<li>' + user.username + '<ul>' + kudosHtml + '</ul></li>';
			});

			$list.append($items);

			$('#kudos-list').html($list);
		});
	});
})
