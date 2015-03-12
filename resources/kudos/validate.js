errorUnless(this.text, 'text', 'required');
errorUnless(this.recipient, 'recipient', 'required');
errorUnless(this.author, 'author', 'required');
errorUnless(me && me.username === this.author, 'author', 'must be the currently signed-in user');

if (!this.date) {
    this.date = new Date().toISOString();
}