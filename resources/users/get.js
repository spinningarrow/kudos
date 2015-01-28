var user = this;

dpd.kudos.get({ recipient: this.username }, function (kudos) {
    user.kudos = kudos;
});