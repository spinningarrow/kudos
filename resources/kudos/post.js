emit('kudos:created', this);

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

dpd.users.get({ username: this.author }, function (authors) {
	dpd.users.get({ username: this.recipient }, function (recipients) {
		var author = authors[0];
		var recipient = recipients[0];
		var subject = 'You\'ve got kudos from ' + author.fullname + '!';
		var text = 'Here are your kudos:\n' + this.text;
		var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
			'<html xmlns="http://www.w3.org/1999/xhtml"><head>' +
			'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
			'<title>You\'ve got kudos!</title>' +
			'<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
			'</head><body>' +
			'<table><tr style="text-align: center;"><td>' +
			'<h2 style="line-height: 1.2;">You\'ve got kudos from <span style="color: #1BADE8;">' + author.fullname + '</span>!</h2>' +
			'<div style="background: #E1F5FC; padding: 10px;">' + escapeHtml(this.text) + '</div>' +
			'<div style="margin-top: 1em"><a href="http://kudos.ecs.ads.autodesk.com/">Check it out here!</a></td></tr></table>' +
			'</body></html>';

		dpd.email.post({
			to: 'sahil29@gmail.com',
			subject: subject,
			text: text,
			html: html
		}, function(result, error) {
			if (error) {
				console.log('Email error', error);
				return;
			}

			console.log('Result', result);
			console.log('Email sent to: ' + recipient.fullname + ' <' + recipient.email + '>');
		});
	});
});
