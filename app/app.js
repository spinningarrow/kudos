var React = require('react');
var KudosApp = require('./components/KudosApp');
// var LoginForm = require('./components/LoginForm');
// var CurrentUserBox = require('./components/CurrentUserBox');

// START Temporary code - need to remove
			loginDone = function loginDone() {
				dpd.users.me(function (user) {
					currentUserBox.setState({ user: user.fullname });
					// $('main').hide();
					toggleSections('everything');
				});
			}

			toggleSections = function toggleSections(sectionToShow) {
				$('.content-login-form').hide();
				$('.content-everything').hide();

				if (sectionToShow === 'login') {
					$('.content-login-form').show();
				} else if (sectionToShow === 'everything') {
					$('.content-everything').show();
				}
			}

			// Hide login form if logged in
			toggleSections(); // hide everything
			dpd.users.me(function (user) {
				if (!user) {
					toggleSections('login');
				} else {
					toggleSections('everything');
				}
			});

// var currentUserBox = React.render(<CurrentUserBox />, document.querySelector('.current-user-badge'));
// END temporary code

// React.render(<LoginForm />, document.querySelector('.content-login-form'));
React.render(<KudosApp/>, document.body);
