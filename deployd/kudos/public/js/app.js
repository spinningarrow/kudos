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
	});
})
