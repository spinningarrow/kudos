var hoodie = new Hoodie();

$(function () {
	var currentUser = hoodie.account.username;

	$('#sign-in').bind('click', function (event) {
		event.preventDefault();
		var password = prompt('Enter your password');
		hoodie.account.signIn('sahil.bajaj@autodesk.com', password);
	})

	// $('#sign-out').bind('click', function (event) {
	// 	event.preventDefault();
	// 	hoodie.account.signOut();
	// 	location.reload();
	// })

	if (currentUser) {
		$('#sign-in').hide();
		$('#current-user').html(currentUser);
	} else {
		$('#sign-out').hide();
	}

	hoodie.global.on('add', function (newObj) {
		$('#data').html(JSON.stringify(JSON.stringify(newObj.data)));
		console.log('newObj', newObj.type, newObj.data || newObj.username);
	})

	hoodie.global.findAll('employee').then(function (employees) {
		console.log('employees', employees);
		$('#data-employees').html(JSON.stringify(employees));
	});

	hoodie.global.findAll('kudo').then(function (kudos) {
		$('#data-kudos').html(JSON.stringify(kudos));
	});
});
