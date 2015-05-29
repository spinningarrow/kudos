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
            text: 'Here is your KUDOS:\n' + this.text
        }, function() {
            console.log('Email sent to: ' + recipient.fullname + ' <' + recipient.email + '>');
        });        
    });
});

emit('kudos:created', this);
