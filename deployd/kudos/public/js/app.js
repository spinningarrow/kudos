$(function () {
	console.log('dom ready.');

	// Do something when the form is submitted
	$('#login-form').submit(function () {

		var username = $('#username').val();
		var password = $('#password').val();

		dpd.users.login({ username: username, password: password });

		return false;
	});
})
