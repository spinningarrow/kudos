dpd.users.get({
    username: this.author
}, function (authors) {
    dpd.users.get({
        username: this.recipient
    }, function (recipients) {
        var author = authors[0];
        var recipient = recipients[0];
        
        dpd.email.post({
            to: recipient.email,
            subject: 'You\'ve got KUDOS from ' + author.fullname + '!',
            text: 'Here is your KUDOS:\n' + this.text,
            html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
                '<html xmlns="http://www.w3.org/1999/xhtml"><head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
                '<title>KUDOS FOR YOU!</title>' +
                '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' +
                '</head><body>' +
                '<tr style="text-align: center;">' +
                '<h2 style="line-height: 1.2;">You\'ve got KUDOS from <span style="color: #1BADE8;">' + author.fullname + '</span>!</h2>' +
                '<div style="background: #E1F5FC; padding: 10px;">' + this.text + '</div>' +
                '<div style="margin-top: 1em"><a href="http://kudos.ecs.ads.autodesk.com/">Check it out here!</a></tr>' +
                '</body></html>'
        }, function(result, error) {
            console.log('Result:', result);
            console.log('Error', error);
            console.log('Email sent to: ' + recipient.fullname + ' <' + recipient.email + '>');
        });
    });
});

emit('kudos:created', this);
